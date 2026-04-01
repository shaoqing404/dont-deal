# dont-deal

> `dont-deal` 这个名字想表达的是：别为了把活干完、把交易做完、把事情 deal 掉，继续拿自己的命硬换。

> The name `dont-deal` means: do not keep trading your health or your life just to finish the task, close the deal, or push the work through.

## 中文

### 这是什么

`dont-deal` 是一个给程序员、AI 开发者、长期熬夜工作的白领准备的本地优先技能项目。


### 这个版本做的两件事

**第一件：被动感知，让模型知道你最近过得怎么样**

`dont-deal` 会在你授权后，只读分析当前仓库的 git 提交时间戳，推断你近期的睡眠情况——比如上一次提交是凌晨三点，下一次是早上九点，那休息时间大概不超过五小时。

这个推断结果会被写成一份本地快照，并注入你的全局配置（`~/.claude/CLAUDE.md` 或 Codex 对应的 system prompt 路径），让你正在用的模型在帮你写代码的时候，顺带知道一件事：

> 这个人昨晚可能只睡了四小时，今天已经是第三天熬夜了。

不需要你主动说，模型自己就有了背景。

---

**第二件：主动触发，胸口不对劲的时候用**

当你感觉胸口不舒服——闷、紧、压、后背疼、出汗——运行：

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

模型会用中文问你几个简短的问题，结合你当前的疲劳快照，给你一个直接的判断：

- 🔴 **立刻呼救**——不要自己去医院，不要继续工作，先打 120
- 🟡 **今天尽快就医**——不是现在马上，但今天内必须去

只有这两档输出。没有"再观察观察"，没有"可能是工作压力"。

---

### 这是什么

`dont-deal` 是一个给程序员、AI 开发者、长期熬夜工作的白领准备的本地优先技能项目。

它想解决的问题很简单：

- 有些人胸口不舒服时，第一反应不是休息和求助，而是"再 deal 一下"
- 有些人长期熬夜、睡眠不足、高压工作，已经处在更危险的状态里
- 大模型平时并不知道用户最近是不是在连续熬夜，也不知道这个人是否有高血压、家族史之类的背景

这个项目的目标不是代替医生，也不是做正式诊断。

> 别让程序员在胸口疼的时候还继续 deal。

### 为什么做这个项目

很多开发者会把身体报警，当成"熬夜后的正常反应"。

但现实里危险信号常常不长得像教材：

- 不一定是"标准胸痛"
- 可能是胸口发闷、发紧、像被攥住
- 可能是后背里面疼
- 可能像牙疼、下巴酸
- 可能同时伴有出汗、气短、恶心、头晕

用户自己说不清，大模型如果又缺少上下文，就很容易把场景说轻。

`dont-deal` 的设计原则是保守：

- 不淡化胸痛
- 不把熬夜当玩笑
- 信息不完整时，宁可偏谨慎

### 这个版本能做什么

- 读取当前本地时间和时区
- 识别当前运行环境大致是 Codex、Claude Code 还是 OpenClaw 风格宿主
- 只读分析当前仓库的 git 提交时间，推断近期是否存在明显熬夜和短睡风险
- 将疲劳快照注入全局提示词（`~/.claude/CLAUDE.md` 或 Codex 对应路径），无需用户每次手动说明
- 提供快速模式问答，用中文判断当前情况更接近：
  - 🔴 红色：立刻呼救
  - 🟡 黄色：今天尽快就医
- 将快照、配置和本地历史保存在 `~/.dont-deal/` 或你指定的目录

### 它不会做什么

- 不代替医生
- 不给正式诊断结论
- 不默认扫描你的整个电脑
- 不默认读取 GitHub、GitLab、Gitee 权限
- 不修改你的 git 历史、分支、远端或代码
- 不自动发消息、打电话、联网上传数据

### 安装

#### 方式 1：直接克隆源码仓库

```bash
git clone git@github.com:shaoqing404/dont-deal.git
cd dont-deal
```

#### 方式 2：把自包含 skill 包单独拿出来用

这个仓库里已经包含一个可自包含发布的 skill 包：

`skills/dont-deal-triage/`

它自带：

- `SKILL.md`
- `references/`
- `scripts/`
- `package.json`

后续不管是给 Codex、Claude Code，还是给 OpenClaw / ClawHub 用，优先都可以围绕这个目录分发。

### 初始化

第一次使用时，建议你先跑一次快速模式：

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

第一次进入时会：

- 中英双语展示
- 问你几个很短的问题
- 根据你的回答自动记录语言偏好
- 在本地写入：
  - `config.json`
  - `snapshot.json`
  - `events.json`

初始化完成后，快照会自动注入你的全局提示词配置，后续使用 Claude Code 或 Codex 时无需额外操作。

如果你之后希望它记住更长期的健康背景，可以再补 `profile.json` 这类本地资料。

如果你想初始化长期健康背景，可以运行：

```bash
DONT_DEAL_HOME=./data npm run profile:init
```

它会把你愿意保留在本地的信息写进 `profile.json`，并生成一份 `health-summary.md`。

### 怎么使用

#### 1. 看本地疲劳快照

```bash
npm run snapshot
```

如果当前环境不能写入用户主目录，可以自己指定目录：

```bash
DONT_DEAL_HOME=./data npm run snapshot
```

#### 2. 进入快速问诊模式

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

这个模式只想解决一个问题：

- 你现在是不是已经危险到应该立刻呼救
- 如果还没到那个程度，是不是也必须今天去医院看

#### 3. 测试自包含 skill 包

```bash
cd skills/dont-deal-triage
DONT_DEAL_HOME=../../data npm run triage:quick
```

#### 4. 初始化长期背景并注入全局提示词

```bash
DONT_DEAL_HOME=./data npm run profile:init
```

如果你只想单独重写健康摘要并注入提示词，可以运行：

```bash
DONT_DEAL_HOME=./data npm run prompt:inject
```

当前实现会：

- 生成 `health-summary.md`
- 默认尝试写入 `~/.claude/CLAUDE.md`
- 如果你给了 `CODEX_GLOBAL_PROMPT_PATH`，也会在那个路径写入 `dont-deal` 自己的管理块

它不会粗暴覆盖整份文件，只会维护 `dont-deal` 自己的标记区块。

### 什么时候一定要去医院，甚至立刻呼救

下面这些情况，不要继续工作，不要自己硬扛。

#### 模型建议"立刻呼救"的典型情况

- 现在胸口还在痛、闷、紧、压迫感明显
- 疼痛已经持续大约 15 到 20 分钟以上
- 疼痛往左臂、后背、脖子、下巴、牙床放
- 同时有气短、出冷汗、恶心、头晕、快晕倒
- 是在休息时突然发作，不是只是运动后肌肉酸
- 症状正在加重，或者刚缓一点又回来

这类情况，项目的态度是：

> 先呼救，别自己去医院，别路上继续 deal。

#### 模型建议"今天尽快去医院"的典型情况

- 反复出现胸闷、胸痛，尤其是一活动就更明显
- 已知有高血压、糖尿病、吸烟、高血脂、家族早发心脏病等风险因素
- 已知有心绞痛，但这次发作方式和以前不一样
- 虽然没到立刻呼救的程度，但也不能放心

这种情况下，不应该继续拖着写代码、开会、熬夜顶过去。

### 本地数据会保存什么

默认保存在 `~/.dont-deal/`，或者你用 `DONT_DEAL_HOME` 指定的目录。

- `config.json` — 语言偏好、是否完成首次使用
- `snapshot.json` — 当前时间、时区、宿主、git 时间线推断出的疲劳快照
- `events.json` — 每次快速模式的本地记录
- `profile.json` — 用户主动填写的长期健康背景

这些数据默认只在本地，不上传。

### 仓库结构

```text
dont-deal/
├── src/                         # 根仓库开发用源码
├── skills/
│   └── dont-deal-triage/       # 可单独分发的自包含 skill 包
│       ├── SKILL.md
│       ├── agents/
│       ├── references/
│       ├── scripts/
│       └── package.json
├── package.json
└── README.md
```

### 适用平台

- Codex
- Claude Code
- OpenClaw
- ClawHub 风格的 skills 分发

一个实际区别值得说清楚：

- `npm i -g clawhub` 安装的是 ClawHub 命令行
- `clawhub install <skill>` 安装的是 skill 包本身

这个仓库里的嵌套 `package.json`，只是为了让 skill 包内部的 Node 脚本能独立运行，不是要把 skill 本体当成普通 npm 包去发。

### 医疗安全说明

这个项目不是医疗器械，不提供正式医疗诊断。

它参考的是公开急症指引，目标是让模型在危险场景下更保守，而不是更大胆。

如果你真的正在胸痛、胸闷、气短、出汗、头晕，请优先求助现实中的急救和医生，不要把聊天窗口当最终裁决。

参考资料：

- [NHLBI](https://www.nhlbi.nih.gov/health/coronary-heart-disease/symptoms)
- [MedlinePlus](https://medlineplus.gov/ency/article/003079.htm)
- [NHS Chest Pain](https://www.nhs.uk/conditions/chest-pain/)
- [OpenClaw Skills](https://docs.openclaw.ai/skills)
- [OpenClaw ClawHub](https://docs.openclaw.ai/clawhub)

---

## English

### What This Version Does

**First: passive context — let the model know how you've been doing lately**

With your permission, `dont-deal` reads git commit timestamps from the current repository — read-only — and infers your recent sleep pattern. If your last commit was at 3 AM and the next one came in at 9 AM, the estimated rest window is under six hours.

That inference gets written as a local snapshot and injected into your global config (`~/.claude/CLAUDE.md` or the equivalent Codex system prompt path), so the model you're working with already knows:

> This person may have slept four hours last night. This is the third consecutive late night.

You do not need to explain it. The model has the context.

---

**Second: active triage — use this when something feels wrong**

If you feel chest pressure, tightness, heaviness, back pain, or sweating, run:

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

The model asks a few short questions and gives you one of two answers:

- 🔴 **Call for emergency help now** — do not drive yourself, do not keep working
- 🟡 **Get medical care today** — not an immediate emergency, but do not put it off

Only two outputs. No "wait and see." No "probably just stress."

---

### What This Is

`dont-deal` is a local-first skill project for programmers, AI builders, and other people who spend too much time working late.

It is built around one practical problem:

- when chest pain starts, many people try to keep working instead of stopping and asking for help
- long-term sleep loss and overwork can raise concern, but models usually do not know that context
- a model also does not automatically know whether the user has hypertension, family history, or other background risks

This project is not trying to replace a doctor.

> Don't let programmers keep pushing through chest pain.

### Why This Project Exists

Dangerous heart-related symptoms do not always sound dramatic or textbook-correct.

People may describe them as pressure, tightness, heaviness, pain deep in the back, jaw pain, toothache-like discomfort, or sweating with shortness of breath and nausea.

If the user cannot describe it clearly and the model has no context, it is too easy to downplay the situation.

`dont-deal` is intentionally conservative:

- do not minimize chest pain
- do not joke away overwork
- when the picture is unclear, lean safer

### What It Can Do Right Now

- read local time and timezone
- detect the current host environment (Codex, Claude Code, or OpenClaw-style)
- read git commit timestamps from the current repository only — read-only, no modifications
- estimate recent fatigue and short-sleep risk from that data
- inject the fatigue snapshot into your global prompt config so the model has background context without you having to explain it each session
- run a quick triage flow that outputs only two levels: call for help now, or get care today
- save local snapshots and history under `~/.dont-deal/` or a path you specify

### What It Does Not Do

- it does not replace a doctor
- it does not produce a formal diagnosis
- it does not scan your whole machine by default
- it does not inspect GitHub, GitLab, or Gitee credentials by default
- it does not modify git history, branches, remotes, or code
- it does not automatically send messages, place calls, or upload data

### Installation

#### Option 1: Clone the full repository

```bash
git clone git@github.com:shaoqing404/dont-deal.git
cd dont-deal
```

#### Option 2: Use the self-contained skill package

The repository includes a self-contained publishable skill package at:

`skills/dont-deal-triage/`

That folder contains:

- `SKILL.md`
- `references/`
- `scripts/`
- `package.json`

This is the directory to treat as the portable skill bundle for Codex, Claude Code, OpenClaw, or ClawHub-style distribution.

### Initialization

For first use, start with quick mode:

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

On first run it will:

- show bilingual Chinese and English prompts
- ask a few short questions
- detect the user's preferred language from the session
- write local files: `config.json`, `snapshot.json`, `events.json`

After initialization, the snapshot is automatically injected into your global prompt config. No additional steps are needed for Claude Code or Codex to pick it up.

If you want to add longer-term health context later, you can maintain a local `profile.json`.

To initialize longer-term health context:

```bash
DONT_DEAL_HOME=./data npm run profile:init
```

This writes local profile data into `profile.json` and generates `health-summary.md`.

### Usage

#### 1. Generate a local fatigue snapshot

```bash
npm run snapshot
```

If the host cannot write to the home directory:

```bash
DONT_DEAL_HOME=./data npm run snapshot
```

#### 2. Run quick triage mode

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

Two questions this mode is trying to answer:

- is this dangerous enough to call for emergency help right now?
- if not, is it still serious enough to require same-day medical care?

#### 3. Test the self-contained skill package directly

```bash
cd skills/dont-deal-triage
DONT_DEAL_HOME=../../data npm run triage:quick
```

#### 4. Initialize profile data and inject prompt context

```bash
DONT_DEAL_HOME=./data npm run profile:init
```

If you only want to regenerate the summary and prompt block:

```bash
DONT_DEAL_HOME=./data npm run prompt:inject
```

The current implementation:

- generates `health-summary.md`
- writes a managed block into `~/.claude/CLAUDE.md` by default
- also writes to `CODEX_GLOBAL_PROMPT_PATH` when that env var is set

It updates only the `dont-deal` managed block instead of overwriting the entire file.

### When the Model Will Tell You to Act

#### Emergency: call for help now

- chest pain, pressure, tightness, or heaviness is happening right now
- symptoms have lasted around 15 to 20 minutes or longer
- pain spreads to the arm, back, neck, jaw, or gumline
- there is shortness of breath, sweating, nausea, dizziness, or near-fainting
- symptoms started at rest, not from physical exertion
- symptoms are getting worse or returning after partial relief

In those cases:

> Call for help now. Do not drive yourself. Do not keep working.

#### Urgent: get medical care today

- recurrent chest discomfort, especially with exertion
- known risk factors: hypertension, diabetes, smoking, high cholesterol, or family history of early heart disease
- a known angina pattern that has changed in character
- something feels wrong even if the strongest emergency criteria are not met

Do not treat that as something to sleep off while finishing a sprint.

### Local Data

Stored in `~/.dont-deal/` by default, or in the path set through `DONT_DEAL_HOME`.

- `config.json` — language preference, first-run state
- `snapshot.json` — local time, timezone, host context, git-derived fatigue snapshot
- `events.json` — local records from quick triage runs
- `profile.json` — user-provided longer-term health background

Everything is local by default. Nothing is uploaded.

### Repository Layout

```text
dont-deal/
├── src/                         # root development source
├── skills/
│   └── dont-deal-triage/       # self-contained publishable skill package
│       ├── SKILL.md
│       ├── agents/
│       ├── references/
│       ├── scripts/
│       └── package.json
├── package.json
└── README.md
```

### Supported Hosts

- Codex
- Claude Code
- OpenClaw
- ClawHub-style skill distribution

One practical distinction: `npm i -g clawhub` installs the ClawHub CLI. `clawhub install <skill>` installs the skill bundle. The nested `package.json` in this repository exists so the bundled Node scripts can run cleanly inside the self-contained skill package — it is not meant to make the skill a standard npm package.

### Medical Safety Note

This project is not a medical device and does not provide a formal medical diagnosis.

It is based on public emergency guidance and is intentionally designed to make the model more cautious in ambiguous situations, not less.

If you are actively experiencing chest pain, chest pressure, shortness of breath, sweating, or dizziness, real-world medical help takes priority over any chat interface.

References:

- [NHLBI](https://www.nhlbi.nih.gov/health/coronary-heart-disease/symptoms)
- [MedlinePlus](https://medlineplus.gov/ency/article/003079.htm)
- [NHS Chest Pain](https://www.nhs.uk/conditions/chest-pain/)
- [OpenClaw Skills](https://docs.openclaw.ai/skills)
- [OpenClaw ClawHub](https://docs.openclaw.ai/clawhub)
