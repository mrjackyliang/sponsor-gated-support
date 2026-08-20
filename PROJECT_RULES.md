# PROJECT_RULES.md

## Project Identity

### Name and Description

- **Project name:** Sponsor Gated Support (`sponsor-gated-support`)
- **Description:** A GitHub Action designed to help project maintainers manage support requests in a way that encourages sponsorship and recognizes valuable contributors.
- **Primary language:** TypeScript
- **Framework / runtime:** GitHub Actions (Node.js 20 runtime via `runs.using: node20`), bundled with @vercel/ncc

### Repository URL

- **URL:** https://github.com/mrjackyliang/sponsor-gated-support

## Repository Layout

```
sponsor-gated-support/
|-- .github/              - Issue templates, funding config, and CI/CD workflows
|   |-- ISSUE_TEMPLATE/   - Bug report, feature request, and support request forms
|   |-- workflows/        - Nova-generated GitHub Actions workflows (sponsor-check, lock-inactive, publish)
|   `-- FUNDING.yml       - GitHub Sponsors and PayPal funding links
|-- build/                - Committed ncc bundle the action runs (index.js, source map, licenses.txt)
|-- conventions/          - Nova-generated coding convention files (do not edit)
|-- src/                  - TypeScript source code
|   |-- lib/              - Event handlers, Zod schemas, GraphQL utilities
|   `-- types/            - TypeScript type definitions (.d.ts)
|-- .editorconfig         - Editor formatting rules
|-- .env.sample           - Sample env file for local runs via @github/local-action
|-- .gitignore            - Git ignore patterns (.env and package-lock.json are ignored)
|-- action.yml            - GitHub Action metadata: inputs, output, runtime, branding
|-- AGENTS.md             - Nova-generated agent entry point (do not edit)
|-- CLAUDE.md             - Nova-generated agent entry point (do not edit)
|-- eslint.config.js      - ESLint flat config
|-- LICENSE               - MIT license
|-- nova.config.json      - Nova project configuration
|-- package.json          - Node.js manifest and scripts
|-- PROJECT_RULES.md      - This file
|-- README.md             - Project overview, workflow setup, variable reference, PAT guide
|-- tsconfig.json         - TypeScript compiler configuration
`-- VISION.md             - Purpose, marketing copy, and glossary
```

## Source Structure

```
src/
|-- index.ts       - Action entry point; calls runAction()
|-- run.ts         - Orchestrator: loads config, context, and sponsors; logs grouped
|                    output; dispatches by event name (issues / issue_comment)
|-- lib/
|   |-- action.ts  - Event handlers: issuesAction() gates issue opening and locks on
|   |                close; issueCommentAction() moderates comments on gated issues
|   |-- schema.ts  - Zod schemas: configuration (input parsing and defaults),
|   |                issueCommentPayload, issuesPayload, sponsorshipsAsMaintainer
|   `-- utility.ts - GraphQL helpers (addIssueComment, closeIssue, deleteIssueComment,
|                    lockIssue) plus getConfig, getContext, getSponsors (paginated),
|                    and getSponsorsExempt (exempt file reader)
`-- types/
    |-- run.d.ts    - Per-function type aliases for run.ts
    |-- shared.d.ts - Shared Sponsor type (type, login, amount)
    `-- lib/
        |-- action.d.ts  - Per-function type aliases for lib/action.ts
        `-- utility.d.ts - Per-function type aliases for lib/utility.ts
```

## Key Files

| File                 | Purpose                                            | When to modify                                                      |
|----------------------|----------------------------------------------------|---------------------------------------------------------------------|
| `action.yml`         | Action metadata: inputs, defaults, output, runtime | Adding or changing inputs (keep README and `schema.ts` in sync)     |
| `src/run.ts`         | Orchestrator and event dispatch                    | Supporting new event types                                          |
| `src/lib/action.ts`  | Gating and moderation logic                        | Changing what happens on issue open/close or comment created/edited |
| `src/lib/utility.ts` | GraphQL queries/mutations, config, sponsor fetch   | Adding GraphQL operations or changing sponsor collection            |
| `src/lib/schema.ts`  | Zod schemas and input defaults                     | Changing input shape, defaults, or accepted payload fields          |
| `src/types/*.d.ts`   | Per-function type aliases                          | Whenever an exported function signature changes                     |
| `.env.sample`        | Local-run input template                           | Whenever inputs are added or renamed                                |
| `package.json`       | Manifest                                           | Adding dependencies, changing scripts, bumping version              |
| `tsconfig.json`      | TS config                                          | Changing compiler options or the `@/*` path alias                   |
| `build/`             | Committed bundle consumers execute                 | Never by hand; regenerate with `npm run build` before every release |

## Build and Tooling

### Prerequisites

| Tool       | Version                           | Purpose                                               |
|------------|-----------------------------------|-------------------------------------------------------|
| Node.js    | ^22 or ^24 (package.json engines) | Local development, builds, and local action runs      |
| npm        | Bundled with Node.js              | Package manager (`postinstall` triggers a full build) |
| Node.js 20 | Provided by the Actions runner    | Action runtime (`runs.using: node20` in `action.yml`) |

### Commands

| Command               | What it does                                                                      |
|-----------------------|-----------------------------------------------------------------------------------|
| `npm install`         | Install all dependencies; `postinstall` runs the full build                       |
| `npm start`           | Run the action locally via `@github/local-action` using `src/index.ts` and `.env` |
| `npm run build`       | Full build: `build:reset` -> `build:ncc` (sequential)                             |
| `npm run build:reset` | Delete the `./build` directory                                                    |
| `npm run build:ncc`   | Bundle `src/index.ts` into `build/` with source map and `licenses.txt`            |
| `npm run check`       | Full check: `check:lint` -> `check:types-*` -> `check:test` (sequential)          |
| `npm run check:test`  | Run the Vitest test suite                                                         |

Tests run via `npm run check:test` (vitest run). There is no standalone `npm test` script; tests are part of the `check` pipeline.

### Environment Variables

In production, all settings arrive as action inputs through the workflow `with:` block, not environment variables. The exceptions and local-development variables are:

| Variable                                      | Required               | Purpose                                                                                               |
|-----------------------------------------------|------------------------|-------------------------------------------------------------------------------------------------------|
| `GITHUB_REPOSITORY_OWNER`                     | Organization mode only | Provided by the Actions runner; `getSponsors()` throws if `IS_ORGANIZATION` is true and it is missing |
| `INPUT_*` (local `.env` only)                 | No                     | Feed action inputs to `npm start` via `@github/local-action`; see `.env.sample` for the full list     |
| `ACTIONS_RUNNER_DEBUG` / `ACTIONS_STEP_DEBUG` | No                     | Debug output toggles for local runs (in `.env.sample`)                                                |

## Workspace Rules

### Naming Conventions

| Entity                 | Convention                            | Example                                                                                             |
|------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------|
| Action inputs          | SCREAMING_SNAKE_CASE                  | `GITHUB_PERSONAL_ACCESS_TOKEN`, `ISSUE_LOCK_ON_CLOSE`                                               |
| Parsed config keys     | camelCase                             | `githubPersonalAccessToken`, `issueLockOnClose`                                                     |
| Source files           | single lower-case noun                | `action.ts`, `schema.ts`, `utility.ts`                                                              |
| Type aliases           | Module_File_FunctionName_RoleSuffix   | `Lib_Utility_GetSponsors_Config`, `Lib_Utility_GetSponsors_Returns`, `Lib_Utility_LockIssue_NodeId` |
| Webhook payload fields | snake_case (mirrors GitHub API)       | `node_id`, `author_association`                                                                     |
| Local env vars         | `INPUT_` + action input name          | `INPUT_ISSUE_LABELS`                                                                                |
| JSDoc                  | Every export documented with `@since` | `@since 1.0.0`                                                                                      |

### Do / Don't

**Do:**
- Validate every incoming webhook payload with Zod `.safeParse()` and fail with `core.setFailed()` on invalid shapes; parse inputs through the `configuration` schema, which also applies defaults.
- Build GraphQL operations as objects with `json-to-graphql-query` and keep all GraphQL calls in `src/lib/utility.ts`.
- Set the `result` output (`core.setOutput('result', ...)`) on every exit path of an event handler, including skips and failures.
- Use the personal access token (`ghp_`) only to read sponsors, and the workflow token (`ghs_`) for all mutations, so moderation appears as the github-actions bot rather than the repository owner.
- Import through the `@/` path alias with explicit `.js` / `.d.ts` extensions (ESM module resolution).
- Guard early "so runner resources aren't wasted": fail fast with `core.setFailed()` and `result: false` on unsupported actions and disabled settings, and skip with `core.info()` and `result: true` when the issue lacks wanted labels (likewise for insider comments and already-locked issues).
- Regenerate `build/` with `npm run build` and commit it; consumers execute `build/index.js` directly from the pinned tag.

**Don't:**
- Don't edit anything under `build/` by hand; it is @vercel/ncc output and gets overwritten on the next build.
- Don't grant the personal access token write scopes; it needs only `read:org` and `read:user`, and write access would make moderation appear as the owner instead of the bot.
- Don't commit `.env` or `package-lock.json`; both are gitignored (only `.env.sample` is committed).
- Don't edit `CLAUDE.md`, `AGENTS.md`, or `conventions/*.md`; they are generated by Nova's agent-conventions generator and local changes are overwritten.
- Don't throw raw errors out of event handlers; report failures with `core.setFailed()` plus a `result` output and return. Only `getSponsors()` throws intentionally; config parsing (`configuration.parse()`) and the Octokit GraphQL mutations can also throw, and all of these are caught by the `src/run.ts` try/catch.
- Don't use caret or tilde ranges in `package.json`; all dependencies are pinned to exact versions.

## Project-Specific Patterns

### Architecture

Event-driven GitHub Action with a single entry point and one handler per webhook event:

```
GitHub event (issues / issue_comment)
  |
  v
src/index.ts (entry point)
  |
  v
src/run.ts (orchestrator)
  - getConfig() ......... parse action inputs (Zod)
  - getContext() ........ read the workflow context
  - getSponsors() ....... fetch sponsors via GraphQL (paginated, recursive)
  - getSponsorsExempt() . read the exempt file
  |
  v  switch (context.eventName)
src/lib/action.ts (event handlers)
  - issuesAction() ........ gate issue opening; lock on close
  - issueCommentAction() .. moderate comments on gated issues
  |
  v
src/lib/utility.ts (GraphQL mutations via Octokit)
  - addIssueComment / closeIssue / lockIssue / deleteIssueComment
```

### Data Flow

1. **Input** - The Actions runner invokes `build/index.js` with the event payload and inputs. Config and context are loaded via `getConfig()` / `getContext()`. Modules: `src/run.ts`, `src/lib/utility.ts`.
2. **Sponsor collection** - `getSponsors()` queries `sponsorshipsAsMaintainer` 100 nodes per page, recursing on `pageInfo`, filtering by minimum tier amount; `getSponsorsExempt()` reads exempt-file logins, and the orchestrator concatenates the two lists. Modules: `src/lib/utility.ts`, `src/run.ts`.
3. **Validation** - The event payload is validated against `issuesPayload` or `issueCommentPayload` with `.safeParse()`. Module: `src/lib/schema.ts`.
4. **Decision** - The handler compares the issue labels against `ISSUE_LABELS`, then the user against sponsor logins and author association, and chooses welcome, close-and-lock, comment deletion, or skip. Module: `src/lib/action.ts`.
5. **Output** - GraphQL mutations perform the moderation; the `result` output is set and grouped logs (`Configuration`, `Context`, `Sponsors`, `Running`) are written. Modules: `src/lib/utility.ts`, `src/run.ts`.

### Error Strategy

| Layer                | Strategy                                                                                                               |
|----------------------|------------------------------------------------------------------------------------------------------------------------|
| Entry (`src/run.ts`) | try/catch around the whole run; `core.setFailed(error.message)` on any thrown error                                    |
| Event handlers       | No throwing: invalid payload, unsupported action, or misconfiguration -> `core.setFailed()` + `result: false` + return |
| Config load          | `configuration.parse()` throws on invalid inputs (e.g. wrong token prefix); caught by the entry                        |
| Sponsor fetch        | Throws descriptive `Error` on an invalid GraphQL response or missing org owner; caught by the entry                    |
| Exempt file          | try/catch; a missing file logs `core.debug()` and returns an empty list (non-fatal)                                    |
| GraphQL mutations    | Not wrapped locally; network/API errors bubble up to the entry catch                                                   |

## Documentation Site

### Framework

- **Framework:** Docusaurus (via `@cbnventures/docusaurus-preset-nova`)
- **Source directory:** `apps/docs/`

### Site Structure

The documentation site lives at `apps/docs/` and is deployed to GitHub Pages via the `nova-publish-project` workflow. Content is under `apps/docs/docs/` in MDX format.

### Commands

| Command                            | What it does                                |
|------------------------------------|---------------------------------------------|
| `npm run dev` (from `apps/docs`)   | Start the Docusaurus dev server             |
| `npm run build` (from `apps/docs`) | Build the static site to `apps/docs/build/` |

## Publishing and Deployment

### Release Process

This action is distributed through the GitHub repository itself (it is not published to npm). Consumers pin a tag, and the runner executes the committed `build/index.js`.

1. All changes committed, `git status --short` is clean.
2. Bump `version` in `package.json` and update the pinned tag in the README usage example (`mrjackyliang/sponsor-gated-support@vX.Y.Z`).
3. Run `npm run build` and commit the regenerated `build/` output; the tag must contain a bundle matching the source.
4. Tag the commit (e.g. `v1.0.1`) and push commit and tag.
5. Publish a GitHub Release for the tag.

### CI/CD Workflows

Three Nova-generated workflows live under `.github/workflows/`:

| Workflow                                            | Trigger                   | Purpose                                               |
|-----------------------------------------------------|---------------------------|-------------------------------------------------------|
| `nova-check-sponsor-gated-issues-sponsor-check.yml` | `issues`, `issue_comment` | Runs this action against incoming issues and comments |
| `nova-lock-inactive-issues-lock-inactive.yml`       | Weekly schedule, manual   | Locks issues and PRs inactive for 30 days             |
| `nova-publish-project.yml`                          | Release published, manual | Builds, checks, and deploys the action and docs site  |

### Environments

| Environment           | URL / Identifier                                               | Purpose                                                 |
|-----------------------|----------------------------------------------------------------|---------------------------------------------------------|
| GitHub Releases       | https://github.com/mrjackyliang/sponsor-gated-support/releases | Versioned tags that consumers pin                       |
| Consumer repositories | `uses: mrjackyliang/sponsor-gated-support@vX.Y.Z`              | Runs inside consumers' issue workflows on their runners |
