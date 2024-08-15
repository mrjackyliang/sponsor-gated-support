Sponsor Gated Support
======================

[![GitHub Releases](https://img.shields.io/github/v/release/mrjackyliang/sponsor-gated-support?style=flat-square&logo=github&logoColor=%23ffffff&color=%23b25da6)](https://github.com/mrjackyliang/sponsor-gated-support/releases)
[![GitHub Top Languages](https://img.shields.io/github/languages/top/mrjackyliang/sponsor-gated-support?style=flat-square&logo=javascript&logoColor=%23ffffff&color=%236688c3)](https://github.com/mrjackyliang/sponsor-gated-support)
[![GitHub License](https://img.shields.io/github/license/mrjackyliang/sponsor-gated-support?style=flat-square&logo=googledocs&logoColor=%23ffffff&color=%2348a56a)](https://github.com/mrjackyliang/sponsor-gated-support/blob/main/LICENSE)
[![Become a GitHub Sponsor](https://img.shields.io/badge/github-sponsor-gray?style=flat-square&logo=githubsponsors&logoColor=%23ffffff&color=%23eaaf41)](https://github.com/sponsors/mrjackyliang)
[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-gray?style=flat-square&logo=paypal&logoColor=%23ffffff&color=%23ce4a4a)](https://liang.nyc/paypal)

A GitHub Action designed to help project owners and contributors manage support requests (often referred to as "support tickets") in a way that it will encourage sponsorship and recognize valuable work.

In simple terms, this helps limit users who have sponsored the project author, appears as a contributor, or listed via an "exempt file" to be able to open issues.

_Originally, this workflow was not designed in mind to include bug reports and feature requests (in my opinion, those requests should be freely accessible), however, this action is configurable to the specific issue labels that you would like._

To use this action, here are three simple steps you need to follow:
1. Add the action to your repository.
2. [Configure](#workflow-variables) secrets and environment variables.
3. Let the workflow automate issues!

## Workflow Configuration
To create a workflow, simply copy and paste the block of text below to a file named `sponsor-gated-support.yml` and place it under the `/.github/workflows` directory.

Once you have done so, configure the variables by following the [Workflow Variables](#workflow-variables) section.

```yaml
name: "Sponsor Gated Support"

run-name: "Running a task to analyze support issues"

on:
  issue_comment:
    types:
      - "created"
      - "edited"
  issues:
    types:
      - "opened"
      - "closed"

permissions:
  issues: "write"

jobs:
  check-issues:
    runs-on: "ubuntu-latest"
    steps:
      - name: "Checkout repository"
        uses: "actions/checkout@v4"
      - name: "Show current workflow directory"
        run: "ls -la"
      - name: "Check support issues"
        uses: "mrjackyliang/sponsor-gated-support@v1.0.1"
        with:
          GITHUB_PERSONAL_ACCESS_TOKEN: "${{ secrets.PERSONAL_ACCESS_TOKEN }}"
          GITHUB_WORKFLOW_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
          ISSUE_LABELS: "${{ vars.ISSUE_LABELS }}"
          ISSUE_LIMIT_COMMENTER: "${{ vars.ISSUE_LIMIT_COMMENTER }}"
          ISSUE_LOCK_ON_CLOSE: "${{ vars.ISSUE_LOCK_ON_CLOSE }}"
          ISSUE_MESSAGE_NOT_SPONSOR: "${{ vars.ISSUE_MESSAGE_NOT_SPONSOR }}"
          ISSUE_MESSAGE_WELCOME: "${{ vars.ISSUE_MESSAGE_WELCOME }}"
          IS_ORGANIZATION: "${{ vars.IS_ORGANIZATION }}"
          SPONSOR_ACTIVE_ONLY: "${{ vars.SPONSOR_ACTIVE_ONLY }}"
          SPONSOR_EXEMPT_FILE_LOCATION: "${{ vars.SPONSOR_EXEMPT_FILE_LOCATION }}"
          SPONSOR_MINIMUM: "${{ vars.SPONSOR_MINIMUM }}"
```

## Workflow Variables
Here is a list of all the variables used in the action. It is __highly recommended__ that you set all available variables and not resort to the default values. Personalization is key!

You may add variables to your repository via __Settings__ tab > __Security__ section > __Secrets and variables__ dropdown > __Actions__ item.

| Inputs                         | Workflow Variable                   | Description                                                                                 | Required | Accepts                                                                                                          | Default                                                                                                                                               |
|--------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | `secrets.PERSONAL_ACCESS_TOKEN`     | Personal access token from GitHub used to fetch your sponsors                               | `true`   | Token manually generated via the the [Personal Access Tokens (Classic)](https://github.com/settings/tokens) page |                                                                                                                                                       |
| `GITHUB_WORKFLOW_TOKEN`        | `secrets.GITHUB_TOKEN`              | Workflow token from GitHub used to perform issue and issue comment moderation               | `true`   | Token automatically generated on each workflow run                                                               |                                                                                                                                                       |
| `ISSUE_LABELS`                 | `vars.ISSUE_LABELS`                 | Only set limits on issues with these labels (comma de-limited list)                         | `false`  | Comma-delimited list of issue label names. For example, `support` or `support,amazing support`                   | `support`                                                                                                                                             |
| `ISSUE_LIMIT_COMMENTER`        | `vars.ISSUE_LIMIT_COMMENTER`        | Allow only the sponsoring user (that opened the issue) and contributor to comment on issues | `false`  | `true` or `false`                                                                                                | `true`                                                                                                                                                |
| `ISSUE_LOCK_ON_CLOSE`          | `vars.ISSUE_LOCK_ON_CLOSE`          | Lock issues as soon as they become closed                                                   | `false`  | `true` or `false`                                                                                                | `true`                                                                                                                                                |
| `ISSUE_MESSAGE_NOT_SPONSOR`    | `vars.ISSUE_MESSAGE_NOT_SPONSOR`    | Message to send when a non-sponsoring user opens an issue                                   | `false`  | A message for non-sponsors to sponsor you.                                                                       | `Apologies! Only sponsoring users are allowed to open issues. Please sponsor the owner of this repository, then try again.`                           |
| `ISSUE_MESSAGE_WELCOME`        | `vars.ISSUE_MESSAGE_WELCOME`        | Message to send when a sponsoring user opens an issue                                       | `false`  | A message for sponsors to thank them for sponsoring you.                                                         | `Thank you for your support! We appreciate your sponsorship and are here to help. We will review your issue and get back to you as soon as possible.` |
| `IS_ORGANIZATION`              | `vars.IS_ORGANIZATION`              | If this workflow is being used on an organization-owned repository                          | `false`  | `true` or `false`                                                                                                | `false`                                                                                                                                               |
| `SPONSOR_ACTIVE_ONLY`          | `vars.SPONSOR_ACTIVE_ONLY`          | Allow only active sponsoring users to open issues                                           | `false`  | `true` or `false`                                                                                                | `true`                                                                                                                                                |
| `SPONSOR_EXEMPT_FILE_LOCATION` | `vars.SPONSOR_EXEMPT_FILE_LOCATION` | A list of users that are exempt from sponsorship requirement                                | `false`  | File path based on root (not workflow) project directory. For example, `./SPONSOR_EXEMPT`                        | `./SPONSOR_EXEMPT`                                                                                                                                    |
| `SPONSOR_MINIMUM`              | `vars.SPONSOR_MINIMUM`              | Allow only sponsoring users that reach this minimum amount (in cents) to open issues        | `false`  | A number displayed in cents. For example, $0.50 would be `50` and $10.00 would be `1000`                         | `0`                                                                                                                                                   |

__Note:__ When you set your variables, please make sure to set the tokens under the __Secrets__ tab and all other related settings in the __Variables__ tab to ensure your secrets will not be accidentally exposed.

## Retrieve GitHub Personal Access Token
Unlike the automated token (`secrets.GITHUB_TOKEN`) that is randomly generated when a workflow is launched, a Personal Access Token (PAT) allows the action to retrieve active GitHub sponsors from your account.

1. Login to GitHub, and visit the [Personal Access Tokens (Classic)](https://github.com/settings/tokens) page.
2. Click on the "Generate new token" dropdown, and select "Generate new token (classic)".
3. On the "Note" field, type in "GitHub Action - Sponsor Gated Support".
4. On the "Expiration" field, set it to "No expiration".
5. On the "Select scopes" section, select "read:org" and "read:user" permissions.
6. Select the "Generate token" button.
7. Copy the token (starts with `ghp_`) and save it somewhere secure.
8. Use this token in the `GITHUB_PERSONAL_ACCESS_TOKEN` workflow variable.

__Note:__ This token should ONLY be assigned read-only permissions since making changes (e.g. adding or deleting comments) using this token will make it appear like you, and not the "github-actions" bot.

__Note 2:__ If you are planning to use this action on an organization-owned repository, please make sure to set the "Allow access via personal access tokens (classic)" setting in the organization __Settings__ tab > __Third-party access__ section > __Personal access tokens__ dropdown > __Settings__ item.

## Credits and Appreciation
If you find value in the ongoing development of this GitHub action and wish to express your appreciation, you can become my supporter on [GitHub Sponsors](https://github.com/sponsors/mrjackyliang)!
