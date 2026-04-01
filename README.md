# dont-deal

`dont-deal` is a local-first scaffold for a developer health companion. The core idea is simple: use signals that already exist on a programmer's machine, such as git activity, local time, and current AI coding host, to add context before a chest-pain or fatigue conversation starts.

This repository currently implements Phase 1 only:

- local fatigue sensing from git history
- host detection for Codex / Claude Code / OpenClaw style environments
- JSON snapshot generation at `~/.dont-deal/snapshot.json`
- a portable skill skeleton under `skills/`

Phase 2 is now partially scaffolded:

- local `profile.json` and `events.json` storage helpers
- local `config.json` for language and first-run behavior
- a conservative fast-triage decision engine that resolves to red or yellow
- quick-mode prompt references for plain-language chest-pain questioning
- an interactive local CLI so you can self-test the quick mode before wiring any host integration

The repository now also carries a self-contained publishable skill package at `skills/dont-deal-triage/`. That folder includes its own `SKILL.md`, `references/`, `scripts/`, and package metadata so it can be distributed independently of the rest of the repo.

It does not diagnose disease, place calls, send messages, or make network requests.

## Why the architecture is split

The repo is structured as two layers:

- `src/`: a host-neutral analyzer that any local tool can execute
- `skills/`: prompt-level wrappers that teach an AI host how to use the analyzer conservatively

This keeps platform churn isolated. If Claude Code, Codex, or OpenClaw use different skill metadata later, the local analyzer stays the same.

## Permission model

`dont-deal` should be deliberately narrow by default.

- detect only the current AI coding host, not every app installed on the machine
- read only the current repository's git metadata for timing analysis
- never modify git history, remotes, branches, or working tree content
- do not inspect GitHub, GitLab, or Gitee credentials unless the user explicitly enables an integration flow
- keep all health history local by default

This means the first-run experience should explain exactly what is being read:

- current local time and timezone
- current host environment signals
- local git commit timestamps from the active repository
- optional user-entered health background data

Anything broader than that should require a separate consent step.

## Repository Layout

```text
dont-deal/
├── src/
│   ├── git-sleep.js
│   ├── host-detect.js
│   ├── system-info.js
│   ├── utils.js
│   └── index.js
├── skills/
│   └── dont-deal-triage/
│       ├── SKILL.md
│       └── references/
│           └── emergency-thresholds.md
├── package.json
└── README.md
```

## Run

```bash
npm run snapshot
```

If a host sandbox cannot write into the user's home directory, set `DONT_DEAL_HOME` to a writable local path. The default remains `~/.dont-deal`.

To try the Phase 2 quick mode locally:

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

That flow asks a few short Chinese questions, classifies the situation as `red` or `yellow`, and appends the result to local `events.json`.
On initialization and first use, the CLI shows Chinese and English together. After that, it auto-updates `config.json` based on the language the user actually used in the session, then defaults to that language on later runs.

To test the self-contained skill package directly:

```bash
cd skills/dont-deal-triage
DONT_DEAL_HOME=../../data npm run triage:quick
```

Example output:

```json
{
  "generated_at": "2026-04-01T14:30:00+08:00",
  "system": {
    "current_time": "2026-04-01T14:30:00+08:00",
    "timezone": "Asia/Shanghai",
    "local_hour": 14,
    "is_late_night": false
  },
  "host": {
    "host": "codex",
    "confidence": "env-var",
    "matched_signals": [
      "CODEX_THREAD_ID",
      "CODEX_CI"
    ],
    "term_program": null
  },
  "sleep": {
    "repository_path": "/path/to/repo",
    "analyzed_days": 7,
    "commits_seen": 48,
    "short_sleep_days": 2,
    "average_sleep_hours_est": 5.8,
    "last_sleep_hours_est": 4.6,
    "longest_short_sleep_streak": 2,
    "last_sleep_window": {
      "previous_day": "2026-03-31",
      "current_day": "2026-04-01",
      "sleep_hours_est": 4.6,
      "short_sleep": true,
      "from_last_commit": "2026-03-31T03:12:00+08:00",
      "to_first_commit": "2026-04-01T07:48:00+08:00"
    },
    "recent_nights": [],
    "risk_flag": "high"
  },
  "overall_fatigue": "high"
}
```

## Local history

The long-term direction should use a small local data model under `~/.dont-deal/`:

- `snapshot.json`: latest derived context from system time, host, and git timing
- `config.json`: local UX preferences such as language and first-run state
- `profile.json`: user-provided baseline data such as hypertension, medications, smoking, family history, emergency contacts
- `events.json`: append-only symptom and reminder history, written only after explicit consent

The point is continuity, not surveillance. The model should remember what the user chose to tell it, plus narrow machine-derived context that is directly relevant to overwork risk.

## Safety Boundary

This project should be conservative by design:

- fatigue inference is context, not diagnosis
- chest pain should never be downplayed by the skill
- if symptoms are active and match red flags, the skill should stop the work conversation and push the user toward emergency help

The emergency thresholds used in the bundled skill references were checked against public guidance from NIH/NHLBI, MedlinePlus, and NHS pages:

- [NHLBI: Angina symptoms](https://www.nhlbi.nih.gov/health/angina/symptoms)
- [NHLBI: What is angina?](https://www.nhlbi.nih.gov/node/4881)
- [MedlinePlus: Chest pain](https://medlineplus.gov/ency/article/003079.htm)
- [NHS: Chest pain](https://www.nhs.uk/conditions/chest-pain/)

For OpenClaw portability, the project follows the same folder-centered skill idea described in the official OpenClaw docs:

- [OpenClaw docs: Skills](https://docs.openclaw.ai/skills)
- [OpenClaw docs: ClawHub](https://docs.openclaw.ai/clawhub)

Important distinction:

- OpenClaw installs skills as local skill folders, often via `openclaw skills install ...` or `clawhub install ...`
- `npm i -g clawhub` installs the ClawHub CLI, not the skill itself
- this repository includes a nested `package.json` in the skill folder only so the self-contained package can run its local Node scripts cleanly after installation

## Phase 2 Direction

The next useful step is not a UI. It is a real triage flow:

1. collect symptom prompts one turn at a time
2. combine symptom severity with the local fatigue snapshot
3. store a local health profile in JSON
4. add a consented integration layer for macOS emergency shortcuts or messages
5. keep repository inspection strictly read-only
