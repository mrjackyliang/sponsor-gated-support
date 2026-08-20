# VISION.md

## Purpose

### Problem Statement

GitHub issues are open to everyone, so project owners end up providing free, time-consuming support to users who have never sponsored or contributed to the project. GitHub has no built-in way to restrict who can open support requests (often referred to as "support tickets") or who can comment on them, so maintainers either answer everything or manually close, lock, and moderate issues by hand. Sponsorship, meanwhile, offers supporters nothing tangible in return.

### Target Audience

- **Project owners with GitHub Sponsors** - Maintainers who want support requests reserved for the people funding the work, without moderating issues by hand.
- **Contributors and collaborators** - People whose valuable work on the project is recognized with support access, no sponsorship required (members, owners, contributors, and collaborators bypass the gate automatically).
- **Organizations** - Teams running GitHub Sponsors on an organization account who want the same gating on organization-owned repositories (via the `IS_ORGANIZATION` mode).

### Value Proposition

Sponsor Gated Support is a GitHub Action that helps project owners and contributors manage support requests in a way that encourages sponsorship and recognizes valuable work. When an issue with a gated label is opened, it checks the author against your live GitHub Sponsors list, your contributor roster, and an exempt file, then welcomes eligible users or posts a configurable message and closes and locks everyone else. Gating applies only to the issue labels you configure, so bug reports and feature requests can stay freely accessible.

## Marketing Copy

### Tagline

Ensure that only sponsors and recognized contributors have access to support.

### Elevator Pitch

Sponsor Gated Support is a GitHub Action that helps project owners and contributors manage support requests (often referred to as "support tickets") in a way that encourages sponsorship and recognizes valuable work. It limits issue opening to users who sponsor the project author, appear as contributors, or are listed in an exempt file; everyone else receives a configurable message and their issue is automatically closed and locked. Only the issue labels you choose are gated (default: `support`), so bug reports and feature requests stay freely accessible. Setup takes three steps: add the action to your repository, configure secrets and variables, and let the workflow automate your issues.

### Key Features

- **Sponsor-gated issue opening** - Checks the issue author against your live GitHub Sponsors list (fetched via the GraphQL API with pagination) and either posts a welcome message or posts a not-sponsor message, closes, and locks the issue.
- **Contributor recognition** - Members, owners, contributors, and collaborators bypass the sponsorship requirement automatically based on GitHub's author association.
- **Exempt file** - A newline-delimited list of usernames (default: `./SPONSOR_EXEMPT`) grants support access to anyone you choose, no sponsorship required.
- **Label scoping** - Only issues carrying the labels in `ISSUE_LABELS` are gated, so you decide which request types require sponsorship.
- **Sponsorship thresholds** - Require active sponsorships only (`SPONSOR_ACTIVE_ONLY`) and set a minimum monthly tier amount in cents (`SPONSOR_MINIMUM`).
- **Comment moderation** - With `ISSUE_LIMIT_COMMENTER`, comments on gated issues from anyone other than the issue creator, members, owners, contributors, or collaborators are deleted.
- **Lock on close** - With `ISSUE_LOCK_ON_CLOSE`, gated issues are locked as soon as they are closed.
- **Customizable messaging** - Both the welcome message and the not-sponsor message are fully configurable workflow variables.

### Differentiators

| This project                                                                                     | Alternatives                                                               |
|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| Checks live GitHub Sponsors data on every issue event, including tier amount and active status   | Manual cross-checking of sponsor lists, or static allowlists that go stale |
| Gates only the issue labels you configure; bug reports and feature requests stay open            | All-or-nothing approaches such as disabling issues entirely                |
| Moderates through the workflow token, so actions appear as the github-actions bot and not as you | Manual closing and locking that shows up under the maintainer's name       |
| Recognizes contributors and collaborators automatically, and supports an exempt file             | Sponsorship paywalls that ignore non-monetary contributions                |

## Glossary

| Term                        | Definition                                                                                                                                                                                                                                                 |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Support request             | An issue asking for help, marked with one of the gated labels configured in `ISSUE_LABELS` (default: `support`). Also called a "support ticket".                                                                                                           |
| Sponsor                     | A user or organization sponsoring the repository owner through GitHub Sponsors, fetched live via the GraphQL `sponsorshipsAsMaintainer` query.                                                                                                             |
| Active sponsor              | A sponsor whose sponsorship is currently active. `SPONSOR_ACTIVE_ONLY` limits gating checks to these.                                                                                                                                                      |
| Exempt file                 | A newline-delimited list of GitHub usernames in the consumer repository (default: `./SPONSOR_EXEMPT`) treated as sponsors without payment.                                                                                                                 |
| Sponsor minimum             | The `SPONSOR_MINIMUM` amount in cents. Sponsors whose tier `monthlyPriceInCents` is below it are treated as non-sponsors.                                                                                                                                  |
| Tier                        | A GitHub Sponsors pricing tier. Its `monthlyPriceInCents` value is compared against the sponsor minimum.                                                                                                                                                   |
| Author association          | GitHub's relationship field on issues and comments (`OWNER`, `MEMBER`, `CONTRIBUTOR`, `COLLABORATOR`, `NONE`, etc.). Insider associations bypass gating.                                                                                                   |
| Personal access token (PAT) | A classic `ghp_` token with `read:org` and `read:user` scopes, used only to fetch sponsors (`GITHUB_PERSONAL_ACCESS_TOKEN`).                                                                                                                               |
| Workflow token              | The `ghs_` token GitHub generates per workflow run (`secrets.GITHUB_TOKEN`), used for all issue moderation so actions appear as the github-actions bot.                                                                                                    |
| Organization mode           | `IS_ORGANIZATION` set to `true`. Sponsors are queried on the organization named by `GITHUB_REPOSITORY_OWNER` instead of the token's own account.                                                                                                           |
| Node ID                     | GitHub's GraphQL global identifier (`node_id`) for an issue or comment, used to target mutations (comment, close, lock, delete).                                                                                                                           |
| result                      | The action's single output. `true` when handling completed or was intentionally skipped, `false` on any failure — including unsupported events, event-handler errors, and orchestrator-level errors (config parsing, sponsor fetch, or unexpected throws). |
