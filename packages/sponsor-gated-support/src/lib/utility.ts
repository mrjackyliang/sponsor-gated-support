import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import * as core from '@actions/core';
import * as github from '@actions/github';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import _ from 'lodash';

import { configuration, sponsorshipsAsMaintainer } from './schema.js';

import type {
  Lib_Utility_AddIssueComment_Body,
  Lib_Utility_AddIssueComment_Config,
  Lib_Utility_AddIssueComment_NodeId,
  Lib_Utility_AddIssueComment_Returns,
  Lib_Utility_CloseIssue_Config,
  Lib_Utility_CloseIssue_NodeId,
  Lib_Utility_CloseIssue_Returns,
  Lib_Utility_DeleteIssueComment_Config,
  Lib_Utility_DeleteIssueComment_NodeId,
  Lib_Utility_DeleteIssueComment_Returns,
  Lib_Utility_GetConfig_Returns,
  Lib_Utility_GetContext_Returns,
  Lib_Utility_GetSponsors_Config,
  Lib_Utility_GetSponsors_Cursor,
  Lib_Utility_GetSponsors_Data,
  Lib_Utility_GetSponsors_NewResults,
  Lib_Utility_GetSponsors_OctokitResponse,
  Lib_Utility_GetSponsors_OctokitResponsePath,
  Lib_Utility_GetSponsors_OctokitResponseRoot,
  Lib_Utility_GetSponsors_ParsedSponsorships,
  Lib_Utility_GetSponsors_Results,
  Lib_Utility_GetSponsors_Returns,
  Lib_Utility_GetSponsors_Sponsorships,
  Lib_Utility_GetSponsorsExempt_Config,
  Lib_Utility_GetSponsorsExempt_Exempts,
  Lib_Utility_GetSponsorsExempt_File,
  Lib_Utility_GetSponsorsExempt_Returns,
  Lib_Utility_GetSponsorsExempt_SponsorExemptFileLocation,
  Lib_Utility_LockIssue_Config,
  Lib_Utility_LockIssue_NodeId,
  Lib_Utility_LockIssue_Returns,
} from '../types/lib/utility.d.ts';

/**
 * Lib - Utility - Add Issue Comment.
 *
 * Adds a comment to the target issue using the workflow token,
 * executing the mutation through the GitHub GraphQL API.
 *
 * @param {Lib_Utility_AddIssueComment_NodeId} nodeId - Node id.
 * @param {Lib_Utility_AddIssueComment_Body}   body   - Body.
 * @param {Lib_Utility_AddIssueComment_Config} config - Config.
 *
 * @returns {Lib_Utility_AddIssueComment_Returns}
 *
 * @since 1.0.1
 */
export async function addIssueComment(nodeId: Lib_Utility_AddIssueComment_NodeId, body: Lib_Utility_AddIssueComment_Body, config: Lib_Utility_AddIssueComment_Config): Lib_Utility_AddIssueComment_Returns {
  await github.getOctokit(config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
    mutation: {
      addComment: {
        __args: {
          input: {
            subjectId: nodeId,
            body,
          },
        },
        subject: {
          id: true,
        },
      },
    },
  }));

  return;
}

/**
 * Lib - Utility - Close Issue.
 *
 * Closes the target issue using the workflow token, executing the
 * mutation through the GitHub GraphQL API.
 *
 * @param {Lib_Utility_CloseIssue_NodeId} nodeId - Node id.
 * @param {Lib_Utility_CloseIssue_Config} config - Config.
 *
 * @returns {Lib_Utility_CloseIssue_Returns}
 *
 * @since 1.0.1
 */
export async function closeIssue(nodeId: Lib_Utility_CloseIssue_NodeId, config: Lib_Utility_CloseIssue_Config): Lib_Utility_CloseIssue_Returns {
  await github.getOctokit(config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
    mutation: {
      closeIssue: {
        __args: {
          input: {
            issueId: nodeId,
          },
        },
        issue: {
          id: true,
        },
      },
    },
  }));

  return;
}

/**
 * Lib - Utility - Delete Issue Comment.
 *
 * Deletes the target issue comment using the workflow token,
 * executing the mutation through the GitHub GraphQL API.
 *
 * @param {Lib_Utility_DeleteIssueComment_NodeId} nodeId - Node id.
 * @param {Lib_Utility_DeleteIssueComment_Config} config - Config.
 *
 * @returns {Lib_Utility_DeleteIssueComment_Returns}
 *
 * @since 1.0.1
 */
export async function deleteIssueComment(nodeId: Lib_Utility_DeleteIssueComment_NodeId, config: Lib_Utility_DeleteIssueComment_Config): Lib_Utility_DeleteIssueComment_Returns {
  await github.getOctokit(config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
    mutation: {
      deleteIssueComment: {
        __args: {
          input: {
            id: nodeId,
          },
        },
        clientMutationId: true,
      },
    },
  }));

  return;
}

/**
 * Lib - Utility - Get Config.
 *
 * Reads every action input from the workflow environment and
 * validates them into a typed configuration object.
 *
 * @returns {Lib_Utility_GetConfig_Returns}
 *
 * @since 1.0.1
 */
export function getConfig(): Lib_Utility_GetConfig_Returns {
  return configuration.parse({
    githubPersonalAccessToken: core.getInput('GITHUB_PERSONAL_ACCESS_TOKEN'),
    githubWorkflowToken: core.getInput('GITHUB_WORKFLOW_TOKEN'),
    issueLabels: core.getInput('ISSUE_LABELS'),
    issueLimitCommenter: core.getInput('ISSUE_LIMIT_COMMENTER'),
    issueLockOnClose: core.getInput('ISSUE_LOCK_ON_CLOSE'),
    issueMessageNotSponsor: core.getInput('ISSUE_MESSAGE_NOT_SPONSOR'),
    issueMessageWelcome: core.getInput('ISSUE_MESSAGE_WELCOME'),
    isOrganization: core.getInput('IS_ORGANIZATION'),
    sponsorActiveOnly: core.getInput('SPONSOR_ACTIVE_ONLY'),
    sponsorExemptFileLocation: core.getInput('SPONSOR_EXEMPT_FILE_LOCATION'),
    sponsorMinimum: core.getInput('SPONSOR_MINIMUM'),
  });
}

/**
 * Lib - Utility - Get Context.
 *
 * Returns the GitHub Actions context describing the event and
 * repository that triggered the current workflow run.
 *
 * @returns {Lib_Utility_GetContext_Returns}
 *
 * @since 1.0.1
 */
export function getContext(): Lib_Utility_GetContext_Returns {
  return github.context;
}

/**
 * Lib - Utility - Get Sponsors.
 *
 * Recursively fetches every sponsor from the GitHub GraphQL API,
 * paginating and filtering out those below the minimum tier.
 *
 * @param {Lib_Utility_GetSponsors_Config}  config    - Config.
 * @param {Lib_Utility_GetSponsors_Cursor}  [cursor]  - Cursor.
 * @param {Lib_Utility_GetSponsors_Results} [results] - Results.
 *
 * @returns {Lib_Utility_GetSponsors_Returns}
 *
 * @since 1.0.1
 */
export async function getSponsors(config: Lib_Utility_GetSponsors_Config, cursor: Lib_Utility_GetSponsors_Cursor = null, results: Lib_Utility_GetSponsors_Results = []): Lib_Utility_GetSponsors_Returns {
  if (
    config['isOrganization'] === true
    && typeof process.env['GITHUB_REPOSITORY_OWNER'] !== 'string'
  ) {
    throw new Error('Organization mode enabled, but GitHub repository owner environment variable does not exist');
  }

  const octokitResponseRoot: Lib_Utility_GetSponsors_OctokitResponseRoot = (config['isOrganization'] === true) ? 'organization' : 'viewer';
  const octokitResponse: Lib_Utility_GetSponsors_OctokitResponse = await github.getOctokit(config['githubPersonalAccessToken']).graphql(jsonToGraphQLQuery({
    query: {
      [octokitResponseRoot]: {
        ...(config['isOrganization'] === true) ? { __args: { login: process.env['GITHUB_REPOSITORY_OWNER'] } } : {},
        sponsorshipsAsMaintainer: {
          __args: {
            first: 100,
            includePrivate: true,
            activeOnly: config['sponsorActiveOnly'],
            after: cursor,
          },
          nodes: {
            sponsorEntity: {
              __on: [
                {
                  __typeName: 'User',
                  login: true,
                },
                {
                  __typeName: 'Organization',
                  login: true,
                },
              ],
            },
            tier: {
              monthlyPriceInCents: true,
            },
          },
          pageInfo: {
            endCursor: true,
            hasNextPage: true,
          },
          totalCount: true,
        },
      },
    },
  }));
  const octokitResponsePath: Lib_Utility_GetSponsors_OctokitResponsePath = [
    octokitResponseRoot,
    'sponsorshipsAsMaintainer',
  ];
  const sponsorships: Lib_Utility_GetSponsors_Sponsorships = _.get(octokitResponse, octokitResponsePath, {});
  const parsedSponsorships: Lib_Utility_GetSponsors_ParsedSponsorships = sponsorshipsAsMaintainer.safeParse(sponsorships);

  // Stop if parsed sponsorships is not valid.
  if (parsedSponsorships.success === false) {
    throw new Error('There was an error retrieving sponsorships');
  }

  const data: Lib_Utility_GetSponsors_Data = parsedSponsorships.data;

  // Accumulate results.
  const newResults: Lib_Utility_GetSponsors_NewResults = [
    ...results,
    ...data['nodes'].map((node) => {
      // Login username is required to match issue opener and commenter.
      if (
        node['sponsorEntity'] === null
        || node['tier'] === null
      ) {
        return null;
      }

      // Skip sponsors that do not meet the minimum sponsorship amount.
      if (node['tier']['monthlyPriceInCents'] < config['sponsorMinimum']) {
        return null;
      }

      return {
        type: 'github-api' as const,
        login: node['sponsorEntity']['login'],
        amount: node['tier']['monthlyPriceInCents'],
      };
    }).filter((node) => node !== null),
  ];

  // Check if there are more pages.
  if (data['pageInfo']['hasNextPage'] === true) {
    return getSponsors(
      config,
      data['pageInfo']['endCursor'],
      newResults,
    );
  }

  return newResults;
}

/**
 * Lib - Utility - Get Sponsors Exempt.
 *
 * Reads the optional exempt file and returns each listed login as
 * a sponsor entry, returning an empty list when the file is absent.
 *
 * @param {Lib_Utility_GetSponsorsExempt_Config} config - Config.
 *
 * @returns {Lib_Utility_GetSponsorsExempt_Returns}
 *
 * @since 1.0.1
 */
export function getSponsorsExempt(config: Lib_Utility_GetSponsorsExempt_Config): Lib_Utility_GetSponsorsExempt_Returns {
  const sponsorExemptFileLocation: Lib_Utility_GetSponsorsExempt_SponsorExemptFileLocation = config['sponsorExemptFileLocation'];

  try {
    const file: Lib_Utility_GetSponsorsExempt_File = readFileSync(resolve(sponsorExemptFileLocation), 'utf8');
    const exempts: Lib_Utility_GetSponsorsExempt_Exempts = file.split('\n');

    return exempts.map((exempt) => ({
      type: 'exempt-file' as const,
      login: exempt.trim(),
      amount: null,
    })).filter((exempt) => exempt['login'] !== '');
  } catch {
    core.debug(`"${sponsorExemptFileLocation}" not found. Skipping...`);

    return [];
  }
}

/**
 * Lib - Utility - Lock Issue.
 *
 * Locks the target issue using the workflow token, preventing
 * further comments through the GitHub GraphQL API.
 *
 * @param {Lib_Utility_LockIssue_NodeId} nodeId - Node id.
 * @param {Lib_Utility_LockIssue_Config} config - Config.
 *
 * @returns {Lib_Utility_LockIssue_Returns}
 *
 * @since 1.0.1
 */
export async function lockIssue(nodeId: Lib_Utility_LockIssue_NodeId, config: Lib_Utility_LockIssue_Config): Lib_Utility_LockIssue_Returns {
  await github.getOctokit(config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
    mutation: {
      lockLockable: {
        __args: {
          input: {
            lockableId: nodeId,
          },
        },
        lockedRecord: {
          locked: true,
        },
      },
    },
  }));

  return;
}
