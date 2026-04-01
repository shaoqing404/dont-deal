#!/usr/bin/env node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { detectHost } from "./host-detect.js";
import { loadProfile } from "./profile-store.js";
import { generateSnapshot } from "./index.js";
import { dontDealHome, ensureDirectory, pathExists } from "./utils.js";

const START_MARKER = "<!-- dont-deal:start -->";
const END_MARKER = "<!-- dont-deal:end -->";

function defaultClaudePromptPath() {
  return path.join(os.homedir(), ".claude", "CLAUDE.md");
}

function defaultCodexPromptPath() {
  return null;
}

function promptTargets(env = process.env) {
  return [
    {
      host: "claude-code",
      path: env.CLAUDE_GLOBAL_PROMPT_PATH ?? defaultClaudePromptPath()
    },
    {
      host: "codex",
      path: env.CODEX_GLOBAL_PROMPT_PATH ?? defaultCodexPromptPath()
    }
  ].filter((target) => Boolean(target.path));
}

function compactList(values) {
  return values.filter(Boolean).join(", ");
}

function buildHealthSummary({ profile, snapshot }) {
  const risks = profile.baseline_risks ?? {};
  const positiveRisks = [
    risks.hypertension ? "hypertension" : null,
    risks.diabetes ? "diabetes" : null,
    risks.smoking ? "smoking" : null,
    risks.high_cholesterol ? "high cholesterol" : null,
    risks.family_history_early_heart_disease ? "family history of early heart disease" : null
  ].filter(Boolean);

  const medications = profile.medications ?? [];
  const notes = profile.notes ?? [];

  const lines = [
    "# dont-deal health context",
    "",
    "Use this as cautionary context, not as diagnosis.",
    "",
    `- Last generated: ${snapshot.generated_at}`,
    `- Overall fatigue: ${snapshot.overall_fatigue}`,
    `- Host seen: ${snapshot.host.host}`,
    `- Recent git sleep risk: ${snapshot.sleep.risk_flag}`,
    `- Estimated last sleep window: ${snapshot.sleep.last_sleep_hours_est ?? "unknown"} hours`,
    `- Age range: ${profile.person?.age_range ?? "unknown"}`,
    `- Sex: ${profile.person?.sex ?? "unknown"}`,
    `- Baseline risks: ${compactList(positiveRisks) || "none recorded"}`,
    `- Medications: ${compactList(medications) || "none recorded"}`,
    `- Notes: ${compactList(notes) || "none recorded"}`,
    "",
    "Behavior rules:",
    "- If the user reports active chest pain, chest pressure, spreading pain, shortness of breath, sweating, nausea, or near-fainting, do not downplay it.",
    "- If emergency features are present, tell the user to stop working and seek emergency help.",
    "- Treat fatigue and sleep loss as added caution context only."
  ];

  return lines.join("\n");
}

function buildManagedBlock(summary) {
  return [START_MARKER, summary, END_MARKER].join("\n");
}

function replaceManagedBlock(existingText, block) {
  const pattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`, "m");
  if (pattern.test(existingText)) {
    return existingText.replace(pattern, block);
  }

  const trimmed = existingText.trimEnd();
  return trimmed ? `${trimmed}\n\n${block}\n` : `${block}\n`;
}

async function writeManagedPrompt(targetPath, block) {
  const existing = (await pathExists(targetPath)) ? await fs.readFile(targetPath, "utf8") : "";
  const next = replaceManagedBlock(existing, block);
  await ensureDirectory(path.dirname(targetPath));
  await fs.writeFile(targetPath, next, "utf8");
}

export async function injectPromptContext(options = {}) {
  const env = options.env ?? process.env;
  const snapshot = await generateSnapshot({ env, cwd: options.cwd ?? process.cwd() });
  const profile = await loadProfile(env);
  const summary = buildHealthSummary({ profile, snapshot });
  const summaryPath = path.join(dontDealHome(env), "health-summary.md");

  await ensureDirectory(dontDealHome(env));
  await fs.writeFile(summaryPath, summary + "\n", "utf8");

  const managedBlock = buildManagedBlock(summary);
  const writtenTargets = [];

  for (const target of promptTargets(env)) {
    await writeManagedPrompt(target.path, managedBlock);
    writtenTargets.push(target);
  }

  return {
    summary_path: summaryPath,
    targets: writtenTargets,
    snapshot
  };
}

async function main() {
  const result = await injectPromptContext();
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
