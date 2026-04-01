# dont-deal

## 中文

### 这是什么

`dont-deal` 是一个给程序员、AI 开发者、长期熬夜工作的白领准备的本地优先技能项目。

它想解决的问题很简单：

- 有些人胸口不舒服时，第一反应不是休息和求助，而是“再 deal 一下”
- 有些人长期熬夜、睡眠不足、高压工作，已经处在更危险的状态里
- 大模型平时并不知道用户最近是不是在连续熬夜，也不知道这个人是否有高血压、家族史之类的背景

这个项目的目标不是代替医生，也不是做正式诊断。

它只做两件事：

1. 给模型一些本地背景信息，比如当前时间、当前宿主环境、当前仓库的 git 提交时间，帮助模型判断你最近是不是在硬扛。
2. 在“胸痛/胸闷/疑似心绞痛或心梗”的场景下，用简单直接的话帮助用户判断：
   现在是应该立刻呼救，还是应该当天尽快去医院。

一句话说，这个项目是：

> 别让程序员在胸口疼的时候还继续 deal。

### 为什么做这个项目

很多开发者会把身体报警，当成“熬夜后的正常反应”。

但现实里危险信号常常不长得像教材：

- 不一定是“标准胸痛”
- 可能是胸口发闷、发紧、像被攥住
- 可能是后背里面疼
- 可能像牙疼、下巴酸
- 可能同时伴有出汗、气短、恶心、头晕

用户自己说不清，大模型如果又缺少上下文，就很容易把场景说轻。

`dont-deal` 的设计原则是保守：

- 不淡化胸痛
- 不把熬夜当玩笑
- 信息不完整时，宁可偏谨慎

### 这个项目现在能做什么

- 读取当前本地时间和时区
- 识别当前运行环境大致是 Codex、Claude Code 还是 OpenClaw 风格宿主
- 只读分析当前仓库的 git 提交时间，推断近期是否存在明显熬夜和短睡风险
- 提供快速模式问答，用中文快速判断更接近：
  - 红色：立刻呼救
  - 黄色：今天尽快就医
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

如果你之后希望它记住更长期的健康背景，可以再补 `profile.json` 这类本地资料。

### 怎么使用

#### 1. 看本地疲劳快照

```bash
npm run snapshot
```

如果当前环境不能写入用户主目录，可以自己指定目录：

```bash
DONT_DEAL_HOME=./data npm run snapshot
```

#### 2. 进入快速模式

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

### 什么时候一定要去医院，甚至立刻呼救

下面这些情况，不要继续工作，不要自己硬扛。

#### 模型建议“立刻呼救”的典型情况

- 现在胸口还在痛、闷、紧、压迫感明显
- 疼痛已经持续大约 15 到 20 分钟以上
- 疼痛往左臂、后背、脖子、下巴、牙床放
- 同时有气短、出冷汗、恶心、头晕、快晕倒
- 是在休息时突然发作，不是只是运动后肌肉酸
- 症状正在加重，或者刚缓一点又回来

这类情况，项目的态度是：

> 先呼救，别自己去医院，别路上继续 deal。

#### 模型建议“今天尽快去医院”的典型情况

- 反复出现胸闷、胸痛，尤其是一活动就更明显
- 已知有高血压、糖尿病、吸烟、高血脂、家族早发心脏病等风险因素
- 已知有心绞痛，但这次发作方式和以前不一样
- 虽然没到立刻呼救的程度，但也不能放心

这种情况下，不应该继续拖着写代码、开会、熬夜顶过去。

### 本地数据会保存什么

默认保存在 `~/.dont-deal/`，或者你用 `DONT_DEAL_HOME` 指定的目录。

- `config.json`
  - 语言偏好
  - 是否完成首次使用
- `snapshot.json`
  - 当前时间、时区、宿主、git 时间线推断出的疲劳快照
- `events.json`
  - 每次快速模式的本地记录
- `profile.json`
  - 用户主动填写的长期健康背景

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

这里要区分两件事：

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

### What This Is

`dont-deal` is a local-first skill project for programmers, AI builders, and other people who spend too much time working late.

It is built around one practical problem:

- when chest pain starts, many people try to keep working instead of stopping and asking for help
- long-term sleep loss and overwork can raise concern, but models usually do not know that context
- a model also does not automatically know whether the user has hypertension, family history, or other background risks

This project is not trying to replace a doctor.

It only tries to do two things:

1. give the model a small amount of local context, such as local time, host environment, and git activity timing
2. help the user answer one urgent question in plain language:
   should I call for emergency help now, or do I need urgent same-day medical care?

### Why This Project Exists

Dangerous heart-related symptoms do not always sound dramatic or textbook-correct.

People may describe them as:

- pressure
- tightness
- heaviness
- pain deep in the back
- jaw pain
- toothache-like discomfort
- sweating, shortness of breath, nausea, or dizziness

If the user cannot describe it clearly and the model has no context, it is too easy to downplay the situation.

`dont-deal` is intentionally conservative:

- do not minimize chest pain
- do not joke away overwork
- when the picture is unclear, lean safer

### What It Can Do Right Now

- read local time and timezone
- detect the current host environment in a narrow way
- read git commit timestamps from the current repository only
- estimate recent fatigue and short-sleep risk
- run a quick triage flow that narrows the answer to:
  - red: call emergency help now
  - yellow: get urgent medical review today
- save local snapshots and local-only history

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

The repository already includes a self-contained publishable skill package:

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
- write local files such as:
  - `config.json`
  - `snapshot.json`
  - `events.json`

Later, you can also maintain a local `profile.json` for longer-term health context.

### Usage

#### 1. Generate a local fatigue snapshot

```bash
npm run snapshot
```

If the host cannot write to the home directory, set a writable local path:

```bash
DONT_DEAL_HOME=./data npm run snapshot
```

#### 2. Run quick triage mode

```bash
DONT_DEAL_HOME=./data npm run triage:quick
```

This mode is intentionally narrow. It is trying to answer only this:

- is this dangerous enough to justify calling emergency help now?
- if not, is this still serious enough that the user should get medical care today?

#### 3. Test the self-contained skill package directly

```bash
cd skills/dont-deal-triage
DONT_DEAL_HOME=../../data npm run triage:quick
```

### When the Model Should Tell the User to See a Doctor

#### Situations that should push toward emergency help now

- chest pain, pressure, tightness, or heaviness is happening right now
- symptoms have lasted around 15 to 20 minutes or longer
- pain spreads to the arm, back, neck, jaw, or gumline
- there is shortness of breath, sweating, nausea, dizziness, or near-fainting
- symptoms start at rest
- symptoms are getting worse or returning again after partial relief

In those cases, the project should push a clear message:

> call for help now, do not drive yourself, and do not keep working through it

#### Situations that should still lead to urgent same-day medical care

- recurrent chest discomfort, especially with exertion
- known cardiovascular risk factors such as hypertension, diabetes, smoking, high cholesterol, or strong family history
- a known angina pattern that has changed
- symptoms that are concerning even if they do not yet meet the strongest emergency pattern

The user should not treat that as something to “sleep off” while continuing to work.

### Local Data

By default data is stored in `~/.dont-deal/`, or in the path set through `DONT_DEAL_HOME`.

- `config.json`
  - language preference
  - first-run state
- `snapshot.json`
  - local time, timezone, host context, and git-derived fatigue snapshot
- `events.json`
  - local records from quick triage runs
- `profile.json`
  - user-provided longer-term health background

Everything is local by default.

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

One practical distinction matters:

- `npm i -g clawhub` installs the ClawHub CLI
- `clawhub install <skill>` installs the skill bundle itself

The nested `package.json` in this repository exists so the bundled Node scripts can run cleanly inside the self-contained skill package. It is not meant to turn the skill into a standard npm-first product.

### Medical Safety Note

This project is not a medical device and does not provide a formal medical diagnosis.

It is based on public emergency guidance and is intentionally designed to make the model more cautious, not less.

If someone is actively experiencing chest pain, chest pressure, shortness of breath, sweating, or dizziness, real-world medical help matters more than any chat interface.

References:

- [NHLBI](https://www.nhlbi.nih.gov/health/coronary-heart-disease/symptoms)
- [MedlinePlus](https://medlineplus.gov/ency/article/003079.htm)
- [NHS Chest Pain](https://www.nhs.uk/conditions/chest-pain/)
- [OpenClaw Skills](https://docs.openclaw.ai/skills)
- [OpenClaw ClawHub](https://docs.openclaw.ai/clawhub)
