# Changelog

All notable changes to `dont-deal` will be documented in this file.

The format is simple and practical:

- `Added` for new features
- `Changed` for meaningful behavior or documentation changes
- `Fixed` for bugs or packaging issues

## [0.1.0] - 2026-04-01

### Added

- Initial `dont-deal` repository scaffold
- Local fatigue snapshot generation from git timestamps, host detection, and system time
- Fast triage engine with red/yellow outcomes for chest-pain-style emergencies
- Interactive local quick-triage CLI with bilingual first-run behavior
- Local `config.json`, `snapshot.json`, `events.json`, and `profile.json` storage model
- Self-contained skill package under `skills/dont-deal-triage/`
- OpenClaw / ClawHub-compatible publishable skill bundle
- Codex metadata under `skills/dont-deal-triage/agents/openai.yaml`

### Changed

- Rewrote `README.md` into a more user-facing bilingual guide
- Clarified the meaning of the name `dont-deal` in the README introduction

### Fixed

- Prevented `src/index.js` from auto-executing when imported as a module by the quick-triage CLI
- Fixed quick-triage language detection so first-run language preference is saved from actual user input
- Packaged runtime scripts inside the skill folder so ClawHub publication does not depend on repo-root source files
