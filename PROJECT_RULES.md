# PROJECT_RULES.md

## Project Identity

### Name and Description

- **Project name:** Sponsor Gated Support (`sponsor-gated-support`)
- **Description:** A GitHub Action designed to help project maintainers manage support requests in a way that encourages sponsorship and recognizes valuable contributors.
- **Primary language:** TypeScript
- **Framework / runtime:** GitHub Actions using the runtime declared in `action.yml`, bundled with `@vercel/ncc`

### Repository URL

- **URL:** https://github.com/mrjackyliang/sponsor-gated-support

## Repository Layout

```
sponsor-gated-support/
|-- .github/              - Issue templates, funding config, and CI/CD workflows
|   |-- ISSUE_TEMPLATE/   - Bug report, feature request, and support request forms
|   |-- workflows/        - Nova-generated GitHub Actions workflows (sponsor-check, lock-inactive, publish)
|   `-- FUNDING.yml       - GitHub Sponsors and PayPal funding links
|-- apps/
|   `-- docs/             - Docusaurus documentation workspace
|-- conventions/          - Nova-generated coding convention files (do not edit)
|-- packages/
|   `-- sponsor-gated-support/
|       |-- build/        - Committed ncc bundle the action runs
|       `-- src/          - Action source, tests, and type declarations
|-- scripts/              - Root maintenance and Nova-linking scripts
|-- tests/                - Root project-contract tests
|-- .editorconfig         - Editor formatting rules
|-- .env.sample           - Sample env file for local runs via @github/local-action
|-- .gitignore            - Git ignore patterns (.env and package-lock.json are ignored)
|-- action.yml            - GitHub Action metadata: inputs, output, runtime, branding
|-- AGENTS.md             - Nova-generated agent entry point (do not edit)
|-- CLAUDE.md             - Nova-generated agent entry point (do not edit)
|-- eslint.config.mts     - Root ESLint flat config
|-- LICENSE               - MIT license
|-- nova.config.json      - Nova project configuration
|-- package.json          - Node.js manifest and scripts
|-- PROJECT_RULES.md      - This file
|-- README.md             - Project overview, workflow setup, variable reference, PAT guide
|-- tsconfig.*.json       - Root configuration, scripts, and test TypeScript projects
`-- VISION.md             - Purpose, marketing copy, and glossary
```

## Source Structure

```
packages/sponsor-gated-support/src/
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

| File                                                | Purpose                                            | When to modify                                                  |
|-----------------------------------------------------|----------------------------------------------------|-----------------------------------------------------------------|
| `action.yml`                                        | Action metadata: inputs, defaults, output, runtime | Adding or changing inputs; keep docs and schemas aligned        |
| `packages/sponsor-gated-support/src/run.ts`         | Orchestrator and event dispatch                    | Supporting new event types                                      |
| `packages/sponsor-gated-support/src/lib/action.ts`  | Gating and moderation logic                        | Changing issue or comment behavior                              |
| `packages/sponsor-gated-support/src/lib/utility.ts` | GraphQL operations, config, sponsor fetch          | Adding GitHub operations or changing sponsor collection         |
| `packages/sponsor-gated-support/src/lib/schema.ts`  | Zod schemas and input defaults                     | Changing input shape, defaults, or payload fields               |
| `packages/sponsor-gated-support/src/types/`         | Per-function type aliases                          | Whenever an exported function signature changes                 |
| `packages/sponsor-gated-support/.env.sample`        | Local-run input template                           | Whenever inputs are added or renamed                            |
| `packages/sponsor-gated-support/package.json`       | Deliverable manifest                               | Adding dependencies, changing scripts, or releasing             |
| `packages/sponsor-gated-support/build/`             | Committed bundle consumers execute                 | Never by hand; regenerate with the package build before release |
| `apps/docs/docusaurus.config.ts`                    | Documentation site configuration                   | Changing docs metadata, navigation, or deployment               |

## Build and Tooling

### Prerequisites

| Tool           | Version source                  | Purpose                                            |
|----------------|---------------------------------|----------------------------------------------------|
| Node.js        | Root `package.json` `engines`   | Local development, builds, and local action runs   |
| npm            | Root `package.json` package pin | Workspace-aware package manager                    |
| Action runtime | Root `action.yml`               | Runtime used by consuming GitHub Actions workflows |

### Commands

| Command                                         | What it does                                                                         |
|-------------------------------------------------|--------------------------------------------------------------------------------------|
| `npm install`                                   | Install every workspace; package postinstall builds the action bundle                |
| `npm run dev`                                   | Run development scripts across workspaces through Nova                               |
| `npm run check`                                 | Run workspace checks, then root lint, type checks, and Vitest suites                 |
| `npm run build`                                 | Build the action bundle and documentation site through Nova                          |
| `npm run deploy`                                | Check and build the repository before generated publishing workflows run             |
| `npm run clean`                                 | Remove workspace build output                                                        |
| `npm run changelog`                             | Record, preview, or cut releases through Nova                                        |
| `npm run recipes`                               | Apply the recipes configured in `nova.config.json`                                   |
| `npm run dev --workspace sponsor-gated-support` | Run the action's TypeScript source locally through `@github/local-action` and `.env` |

Tests run via `npm run check:test` (vitest run). There is no standalone `npm test` script; tests are part of the `check` pipeline.

### Environment Variables

In production, all settings arrive as action inputs through the workflow `with:` block, not environment variables. The exceptions and local-development variables are:

| Variable                                      | Required               | Purpose                                                                                                                               |
|-----------------------------------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `GITHUB_REPOSITORY_OWNER`                     | Organization mode only | Provided by the Actions runner; `getSponsors()` throws if `IS_ORGANIZATION` is true and it is missing                                 |
| `INPUT_*` (local `.env` only)                 | No                     | Feed action inputs to `npm run dev --workspace sponsor-gated-support` via `@github/local-action`; see `.env.sample` for the full list |
| `ACTIONS_RUNNER_DEBUG` / `ACTIONS_STEP_DEBUG` | No                     | Debug output toggles for local runs (in `.env.sample`)                                                                                |

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
| JSDoc                  | Every export documented with `@since` | Use the release value stamped by Nova                                                               |

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
2. Preview and cut the package release with `npm run changelog -- --release --dry-run`, then `npm run changelog -- --release`; generated documentation keeps usage references aligned.
3. Run `npm run check` and `npm run build`; the tag must contain a committed action bundle matching the source.
4. Commit the release result and tag it with the released package version, then push the commit and tag.
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
| Consumer repositories | `uses: mrjackyliang/sponsor-gated-support@<release-tag>`       | Runs inside consumers' issue workflows on their runners |
