# sponsor-gated-support

## 2.0.12 - 2026-11-17

### UPDATED
- Nova is now 0.44.0.

### FIXED
- Workflow logs no longer list sponsors, so private sponsors' logins and monthly amounts stay out of public Actions runs.
- Boolean inputs left empty, such as an unset repository variable, now fall back to their documented defaults instead of failing every run.

## 2.0.11 - 2026-11-01

### UPDATED
- Hardened action publishing with artifact boundary checks, sensitive-file rejection, hidden-file preservation, and fail-fast uploads.
- The action toolchain moves to Nova 0.38.0, Node.js 26 is supported, and package orchestration and TypeScript roles are aligned with current Nova defaults.

## 2.0.10 - 2026-10-18

### UPDATED
- Nova and Docusaurus Preset Nova are now 0.33.0, including the consolidated Nova ESLint preset entry point.
- Replaced Turborepo orchestration with Nova's workspace runner across local commands and the generated publishing workflow.
- Migrated generated ignore settings to Nova's managed multi-file ignore configuration.
- Moved the action's source-mode local runner under the structured development command group.

## 2.0.9 - 2026-10-12

### UPDATED
- Nova and Docusaurus Preset Nova are now 0.30.1.
- Adopted role-based TypeScript preset layers.
- Standardized root-owned tests under the shared project layout.

### FIXED
- Regenerated the action publishing workflow so every published version receives its own releases-branch commit even when bundled runtime bytes are unchanged.

## 2.0.8 - 2026-10-11

### UPDATED
- Nova is now 0.29.0 across the project, action package, and docs, plus the Docusaurus preset at 0.29.0 in docs.
- Completed JavaScript, TypeScript, browser, Node.js, and Docusaurus preset coverage, and consolidated custom Nova lint rules into the shared rule bundle while preserving workspace-specific overrides.
- Declared the root workspace as ESM and assigned Vitest setup type checking to the tests configuration.
- The json-to-graphql-query package is now 2.3.0.
- Recorded README badge and Node.js bug-report settings explicitly in Nova configuration.

## 2.0.7 - 2026-10-03

### UPDATED
- Nova and its Docusaurus preset are now 0.28.0, including the runtime-only Vitest resolution fix.
- Assigned explicit child environments to development, production, build, and deployment script groups.

## 2.0.6 - 2026-09-23

### UPDATED
- Nova and its Docusaurus preset are now 0.27.3, and the generated inactive-thread workflow has write access to pull requests.

## 2.0.5 - 2026-09-18

### UPDATED
- Nova and its Docusaurus preset are now 0.27.2.

### FIXED
- Removed a redundant CommonJS export condition from the ESM package manifest so its entry point stays unambiguous.

## 2.0.4 - 2026-09-16

### UPDATED
- Nova and its Docusaurus preset are now 0.27.1, and the publish workflow is regenerated to use Node 24-ready build attestation and Corepack-managed npm.

## 2.0.3 - 2026-09-16

### UPDATED
- Declared reviewed root dependency install scripts as denied so clean npm installs have an explicit trust policy.
- Disabled Turbo caching for build and check tasks so repository commands no longer accumulate persistent Turbo cache artifacts.
- Aligned workspace scripts, Vitest setup, TypeScript presets, and ESLint file policies with Nova 0.27.0, and replaced the local Markdown table formatter with Nova's built-in recipe.
- Nova and its Docusaurus preset move to 0.27.0, TypeScript to 6.0.3, Zod to 4.4.3, and other pinned dependencies to compatible versions.
- Normalized the package author URL to the canonical trailing-slash form.
- Expanded Nova's GitHub repository sync settings for Actions, labels, security, topics, and sponsorships.

### FIXED
- Corrected documentation workflow examples to use the current v2 action tag instead of v1.0.1.

## 2.0.2 - 2026-08-21

### FIXED
- Updated the GitHub Action runtime from Node 20 to Node 24 ahead of the fall 2026 Node 20 removal from GitHub Actions runners.

## 2.0.1 - 2026-08-20

### UPDATED
- The project homepage URL points to the documentation site, and a logo URL is included for README branding.

## 2.0.0 - 2026-08-20

### UPDATED
- Adopted Nova must-haves generators for .env.sample, .editorconfig, and .gitignore with standardized formatting and ignore patterns.
- Rewrote action source (action.ts, utility.ts, run.ts, index.ts) and type declarations (action.d.ts, utility.d.ts, run.d.ts, shared.d.ts) to follow Nova TypeScript conventions with explicit return types, strict null checks, and shared type layering.
- Migrated from .eslintrc.json to flat ESLint config (eslint.config.mts) with no-shared-type-import enforcement against shared.d.ts and require-import-order for alphabetical specifiers.
- Adopted Nova GitHub generator for CI workflows (nova-check, nova-lock-inactive-issues, nova-publish-project) and issue templates (BUG-REPORT, FEATURE-REQUEST, SUPPORT-REQUEST) with config.yml routing.
- Restructured into a Turborepo monorepo with the action source under packages/sponsor-gated-support/, added turbo.json pipeline, and split tsconfig into app, config, scripts, and tests targets.
- Narrowed OctokitResponseRoot from string to 'organization' | 'viewer' and OctokitResponsePath from string[] to [OctokitResponseRoot, 'sponsorshipsAsMaintainer'] for type-safe GraphQL response traversal.
- The @cbnventures/nova package is now 0.25.2 and @cbnventures/docusaurus-preset-nova is now 0.25.2.
- Regenerated CI workflows with the updated Nova GitHub Action publish template.
- Tightened the root webpack version override to >=5.95.0 <5.106.0 to prevent the Docusaurus 3.10 Progress Plugin incompatibility with webpack 5.106.0 and later.

### FIXED
- Removed a stray trailing double-quote from the debug message logged when the SPONSOR_EXEMPT file is not found.

### ADDED
- Nova AI agent convention scaffolding: AGENTS.md, CLAUDE.md, PROJECT_RULES.md, VISION.md, and 11 language-specific convention files under conventions/.
- Test suites for action handlers (sponsor check and lock-inactive dispatch), schema validation (input parsing and defaults), utility functions (sponsor lookup, exempt file parsing, label filtering), and run entry point (success and failure paths).
- A Docusaurus documentation site with a landing page featuring hero, features, and stats sections, configured with custom primary and secondary colors, fonts, and sidebar navigation.
- Docs test suites for frontmatter validation, internal link checking, markdown table formatting, and terminology cross-references.
- Documentation content: overview with architecture description, usage guide with workflow examples and cron schedules, inputs reference with GITHUB_TOKEN and configuration options, outputs reference with result and locked-threads fields, personal access token guide for fine-grained token setup, and terminology glossary.
- Registered Nova dotenv self-check test suite to validate .env.sample variables match actual usage, and type-declaration inspector to verify .d.ts files mirror source type signatures.

## 1.0.1 - 2024-08-15

### UPDATED
- Clarified README instructions and workflow variable references.

### FIXED
- Comment mistakenly removed when the repository owner comments on a repository owned by their organization.

## 1.0.0 - 2024-08-15

### ADDED
- Initial release: a GitHub Action that gates labeled support issues to sponsors, contributors, and exempted users, replying to and closing/locking issues opened by everyone else.
