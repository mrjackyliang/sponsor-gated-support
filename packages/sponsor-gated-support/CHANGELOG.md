# sponsor-gated-support

## 2.0.0 - 2026-08-20

### UPDATED
- Adopted Nova must-haves generators for .env.sample, .editorconfig, and .gitignore with standardized formatting and ignore patterns.
- Rewrote action source (action.ts, utility.ts, run.ts, index.ts) and type declarations (action.d.ts, utility.d.ts, run.d.ts, shared.d.ts) to follow Nova TypeScript conventions with explicit return types, strict null checks, and shared type layering.
- Migrated from .eslintrc.json to flat ESLint config (eslint.config.mts) with no-shared-type-import enforcement against shared.d.ts and require-import-order for alphabetical specifiers.
- Adopted Nova GitHub generator for CI workflows (nova-check, nova-lock-inactive-issues, nova-publish-project) and issue templates (BUG-REPORT, FEATURE-REQUEST, SUPPORT-REQUEST) with config.yml routing.
- Restructured into a Turborepo monorepo with the action source under packages/sponsor-gated-support/, added turbo.json pipeline, and split tsconfig into app, config, scripts, and tests targets.
- Narrowed OctokitResponseRoot from string to 'organization' | 'viewer' and OctokitResponsePath from string[] to [OctokitResponseRoot, 'sponsorshipsAsMaintainer'] for type-safe GraphQL response traversal.
- Updated @cbnventures/nova to 0.25.1 and @cbnventures/docusaurus-preset-nova to 0.25.1.

### FIXED
- Removed a stray trailing double-quote from the debug message logged when the SPONSOR_EXEMPT file is not found.

### ADDED
- Added Nova AI agent convention scaffolding: AGENTS.md, CLAUDE.md, PROJECT_RULES.md, VISION.md, and 11 language-specific convention files under conventions/.
- Added test suites for action handlers (sponsor check and lock-inactive dispatch), schema validation (input parsing and defaults), utility functions (sponsor lookup, exempt file parsing, label filtering), and run entry point (success and failure paths).
- Added a Docusaurus documentation site with a landing page featuring hero, features, and stats sections, configured with custom primary and secondary colors, fonts, and sidebar navigation.
- Added docs test suites for frontmatter validation, internal link checking, markdown table formatting, and terminology cross-references.
- Added documentation content: overview with architecture description, usage guide with workflow examples and cron schedules, inputs reference with GITHUB_TOKEN and configuration options, outputs reference with result and locked-threads fields, personal access token guide for fine-grained token setup, and terminology glossary.
- Registered Nova dotenv self-check test suite to validate .env.sample variables match actual usage, and type-declaration inspector to verify .d.ts files mirror source type signatures.

## 1.0.1 - 2024-08-15

### UPDATED
- Clarified README instructions and workflow variable references.

### FIXED
- Comment mistakenly removed when the repository owner comments on a repository owned by their organization.

## 1.0.0 - 2024-08-15

### ADDED
- Initial release: a GitHub Action that gates labeled support issues to sponsors, contributors, and exempted users, replying to and closing/locking issues opened by everyone else.
