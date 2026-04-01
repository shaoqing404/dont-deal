#!/usr/bin/env node

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadProfile, saveProfile } from "./profile-store.js";
import { injectPromptContext } from "./prompt-injector.js";

async function askText(rl, question) {
  const answer = await rl.question(`${question}\n> `);
  return answer.trim();
}

async function askYesNoMaybe(rl, question) {
  const answer = await rl.question(`${question}（是/否/跳过）\n> `);
  const value = answer.trim().toLowerCase();
  if (["是", "y", "yes"].includes(value)) {
    return true;
  }
  if (["否", "n", "no"].includes(value)) {
    return false;
  }
  return null;
}

function parseList(answer) {
  return answer
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    output.write("dont-deal profile 初始化\n");
    output.write("这一步只记录你愿意保存在本地的长期健康背景。\n\n");

    const current = await loadProfile(process.env);
    const profile = structuredClone(current);

    const ageRange = await askText(rl, "年龄段？例如 20-29 / 30-39 / 跳过");
    if (ageRange && ageRange !== "跳过") {
      profile.person.age_range = ageRange;
    }

    const sex = await askText(rl, "性别或生理性别信息？例如 male / female / unknown / 跳过");
    if (sex && sex !== "跳过") {
      profile.person.sex = sex;
    }

    profile.baseline_risks.hypertension = await askYesNoMaybe(rl, "是否已知有高血压？");
    profile.baseline_risks.diabetes = await askYesNoMaybe(rl, "是否已知有糖尿病？");
    profile.baseline_risks.smoking = await askYesNoMaybe(rl, "是否长期吸烟？");
    profile.baseline_risks.high_cholesterol = await askYesNoMaybe(rl, "是否已知有高血脂？");
    profile.baseline_risks.family_history_early_heart_disease = await askYesNoMaybe(
      rl,
      "是否有家族早发心脏病史？"
    );

    const medications = await askText(rl, "长期用药有哪些？多个用逗号分隔，跳过就留空");
    if (medications) {
      profile.medications = parseList(medications);
    }

    const contacts = await askText(
      rl,
      "紧急联系人，格式“姓名:电话”，多个用逗号分隔；跳过就留空"
    );
    if (contacts) {
      profile.emergency_contacts = parseList(contacts).map((item) => {
        const [name, phone] = item.split(":").map((part) => part?.trim() ?? "");
        return { name, phone };
      });
    }

    const notes = await askText(rl, "还有什么你希望模型长期记住的健康背景？多个用逗号分隔，跳过就留空");
    if (notes) {
      profile.notes = parseList(notes);
    }

    const saved = await saveProfile(profile, process.env);
    const injection = await injectPromptContext({ env: process.env });

    process.stdout.write(
      JSON.stringify(
        {
          profile: saved,
          prompt_injection: injection
        },
        null,
        2
      ) + "\n"
    );
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  if (error?.code === "ABORT_ERR") {
    process.exitCode = 130;
    return;
  }

  console.error(error);
  process.exitCode = 1;
});
