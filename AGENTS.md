# Hermes Workspace Agent Contract

This workspace uses semantic Hermes swarm workers, not numbered-only lanes. The source of truth for routing is `swarm.yaml`; each worker also has a matching profile under `~/.hermes/profiles/<worker-id>/`, a role skill `<worker-id>-core`, and a wrapper in `~/.local/bin/`.

## Current semantic roster

| Worker | Wrapper | Tools | Skills | MCP | Plugins |
|---|---|---|---|---|---|
| `orchestrator` | `orchestrator:plan` | todo, kanban, delegation, terminal, file, gbrain, session_search, cronjob, skills, clarify, web | orchestrator-core, gstack-for-hermes, gbrain, kanban-orchestrator, subagent-driven-development, writing-plans, requesting-code-review, workspace-dispatch | gbrain | none |
| `km-agent` | `km:health` | gbrain, file, terminal, session_search, skills, todo, cronjob, web | km-agent-core, gbrain, obsidian-markdown, obsidian-cli, obsidian-bases, json-canvas, gstack-for-hermes | gbrain | none |
| `builder` | `builder:task` | terminal, file, browser, web, gbrain, session_search, skills, todo | builder-core, gstack-for-hermes, test-driven-development, systematic-debugging, github-pr-workflow, requesting-code-review, codebase-inspection | gbrain | none |
| `reviewer` | `reviewer:gate` | terminal, file, web, gbrain, session_search, skills | reviewer-core, requesting-code-review, github-code-review, systematic-debugging, gstack-for-hermes, gbrain, codebase-inspection | gbrain | none |
| `qa` | `qa:smoke` | browser, terminal, file, vision, gbrain, session_search, skills, web | qa-core, browser-harness-power-use, dogfood, gstack-for-hermes | gbrain | none |
| `researcher` | `researcher:quick` | gbrain, web, browser, terminal, file, vision, session_search, skills, todo | researcher-core, gbrain, autoresearch, browser-harness-power-use, gstack-for-hermes, researcher-quick, researcher-autoresearch, arxiv, youtube-content, polymarket | gbrain | none |
| `ops-watch` | `ops:health` | terminal, cronjob, file, gbrain, skills, session_search, web | ops-watch-core, gbrain, hermes-agent, systematic-debugging, webhook-subscriptions | gbrain | none |
| `maintainer` | `maintainer:check` | terminal, file, web, browser, gbrain, session_search, skills | maintainer-core, github-repo-management, github-pr-workflow, github-issues, github-code-review, gbrain, gstack-for-hermes, hermes-agent | gbrain | none |
| `strategist` | `strategist:review` | gbrain, web, session_search, file, skills, todo, clarify | strategist-core, gstack-for-hermes, gbrain, writing-plans, polymarket | gbrain | none |
| `inbox-triage` | `inbox:triage` | gbrain, web, file, session_search, todo, skills, terminal | inbox-triage-core, gbrain, obsidian-markdown, gstack-for-hermes, defuddle, youtube-content | gbrain | none |

## Development Crew

| Worker | Wrapper | Model | Tools | Skills | Role |
|---|---|---|---|---|---|
| `grillz` | `grillz:plan` | gpt-5.5 | gbrain, file, session_search, skills, todo, clarify, web, delegation, kanban, memory | grillz-core, gbrain, gstack-for-hermes, writing-plans | Intent discovery, requirements, planning — grills until crystal clear, hands off structured plan |
| `coder` | `coder:task` | gpt-5.3-codex | terminal, file, browser, web, gbrain, session_search, skills, todo | coder-core, gstack-for-hermes, test-driven-development, systematic-debugging, requesting-code-review | Python-to-web general dev; Hermes hooks/cron/plugins specialist |
| `big-d` | `bigD:query` | gpt-5.5 | terminal, file, gbrain, session_search, skills, web | big-d-core, gbrain, gstack-for-hermes, systematic-debugging | Neo4J, Postgres, SQLite, mem0 — schema design, query optimization, data-layer diagnostics |
| `gatekeeper` | `gatekeeper:check` | gpt-5.5-pro | terminal, file, browser, web, gbrain, session_search, skills | gatekeeper-core, systematic-debugging, requesting-code-review, test-driven-development | QA enforcer — tests, validates, greenlights or blocks with evidence |
| `otto` | `otto:review` | gpt-5.5 | file, web, browser, gbrain, session_search, skills, memory | otto-core, gbrain, gstack-for-hermes | Output polish — link validation, content trimming, voice matching to user style |
| `slacker` | `slacker:send` | gpt-5.4 | file, gbrain, session_search, skills, web, messaging | slacker-core, gbrain | Slack-native delivery with intelligent channel routing |
| `joben` | `joben:manage` | gpt-5.5 | terminal, cronjob, file, gbrain, session_search, skills, web, clarify | joben-core, gbrain, hermes-agent, systematic-debugging, gstack-for-hermes | Hermes job lifecycle — create, maintain, audit, diagnose, optimize |

## Operating rules

- Keep `swarm.yaml`, profile `config.yaml`, profile core skills, and wrappers aligned when changing a worker.
- Prefer GBrain-first lookup for context-sensitive RAZSOC/Hermes/workflow decisions.
- Builder implements; Reviewer gates; QA verifies behavior; Orchestrator routes and enforces greenlight.
- Do not enable optional Hermes plugins globally unless the task explicitly needs them; record plugin/toolset alignment in `swarm.yaml` first.

## Development Crew workflow

```
User → Grillz (intent + plan) → Coder / Big D (implement) → Gatekeeper (validate) → Otto (polish) → Slacker (deliver)
```

- **Grillz** starts every non-trivial task — grills for intent, produces plan with DoD, routes to specialists
- **Coder** handles Python, web, Hermes hooks/cron/plugins; uses gpt-5.3-codex
- **Big D** handles all database work — schema, queries, migrations, mem0
- **Gatekeeper** must greenlight before anything ships; uses gpt-5.5-pro for thoroughness
- **Otto** polishes output before delivery — links, voice, fitness
- **Slacker** delivers to Slack; routes by content type and channel landscape
- **Joben** owns all scheduled jobs; grills before creating or changing jobs
