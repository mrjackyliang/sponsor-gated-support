import * as core from '@actions/core';
import * as github from '@actions/github';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import _ from 'lodash';
import fs from 'node:fs';
import path from 'node:path';

import { configuration, sponsorshipsAsMaintainer } from '@/lib/schema.js';
import type {
  AddIssueCommentBody,
  AddIssueCommentConfig,
  AddIssueCommentNodeId,
  AddIssueCommentReturns,
  CloseIssueConfig,
  CloseIssueNodeId,
  CloseIssueReturns,
  GetConfigReturns,
  GetContextReturns,
  GetSponsorsConfig,
  GetSponsorsCursor,
  GetSponsorsExemptConfig,
  GetSponsorsExemptReturns,
  GetSponsorsResults,
  GetSponsorsReturns,
  LockIssueConfig,
  LockIssueNodeId,
  LockIssueReturns,
} from '@/types/index.d.ts';

/**
 * Add issue comment.
 *
 * @param {AddIssueCommentNodeId}  nodeId - Node id.
 * @param {AddIssueCommentBody}    body   - Body.
 * @param {AddIssueCommentConfig}  config - Config.
 *
 * @returns {AddIssueCommentReturns}
 *
 * @since 1.0.0
 */
export async function addIssueComment(nodeId: AddIssueCommentNodeId, body: AddIssueCommentBody, config: AddIssueCommentConfig): AddIssueCommentReturns {
  const { githubWorkflowToken } = config;

  // GraphQL query.
  const query = {
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
  };

  const octokit = github.getOctokit(githubWorkflowToken);

  await octokit.graphql(jsonToGraphQLQuery(query));
}

/**
 * Close issue.
 *
 * @param {CloseIssueNodeId}  nodeId - Node id.
 * @param {CloseIssueConfig}  config - Config.
 *
 * @returns {CloseIssueReturns}
 *
 * @since 1.0.0
 */
export async function closeIssue(nodeId: CloseIssueNodeId, config: CloseIssueConfig): CloseIssueReturns {
  const { githubWorkflowToken } = config;

  // GraphQL query.
  const query = {
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
  };

  const octokit = github.getOctokit(githubWorkflowToken);

  await octokit.graphql(jsonToGraphQLQuery(query));
}

/**
 * Get config.
 *
 * @returns {GetConfigReturns}
 *
 * @since 1.0.0
 */
export function getConfig(): GetConfigReturns {
  const githubPersonalAccessToken = core.getInput('GITHUB_PERSONAL_ACCESS_TOKEN');
  const githubWorkflowToken = core.getInput('GITHUB_WORKFLOW_TOKEN');
  const issueLabels = core.getInput('ISSUE_LABELS');
  const issueLimitCommenter = core.getInput('ISSUE_LIMIT_COMMENTER');
  const issueLockOnClose = core.getInput('ISSUE_LOCK_ON_CLOSE');
  const issueMessageNotSponsor = core.getInput('ISSUE_MESSAGE_NOT_SPONSOR');
  const issueMessageWelcome = core.getInput('ISSUE_MESSAGE_WELCOME');
  const isOrganization = core.getInput('IS_ORGANIZATION');
  const sponsorActiveOnly = core.getInput('SPONSOR_ACTIVE_ONLY');
  const sponsorExemptFileLocation = core.getInput('SPONSOR_EXEMPT_FILE_LOCATION');
  const sponsorMinimum = core.getInput('SPONSOR_MINIMUM');

  return configuration.parse({
    githubPersonalAccessToken,
    githubWorkflowToken,
    issueLabels,
    issueLimitCommenter,
    issueLockOnClose,
    issueMessageNotSponsor,
    issueMessageWelcome,
    isOrganization,
    sponsorActiveOnly,
    sponsorExemptFileLocation,
    sponsorMinimum,
  });
}

/**
 * Get context.
 *
 * @returns {GetContextReturns}
 *
 * @since 1.0.0
 */
export function getContext(): GetContextReturns {
  return github.context;
}

/**
 * Get sponsors.
 *
 * @param {GetSponsorsConfig}  config  - Config.
 * @param {GetSponsorsCursor}  cursor  - Cursor.
 * @param {GetSponsorsResults} results - Results.
 *
 * @returns {GetSponsorsReturns}
 *
 * @since 1.0.0
 */
export async function getSponsors(config: GetSponsorsConfig, cursor: GetSponsorsCursor = null, results: GetSponsorsResults = []): GetSponsorsReturns {
  const {
    githubPersonalAccessToken,
    isOrganization,
    sponsorActiveOnly,
    sponsorMinimum,
  } = config;

  if (
    isOrganization
    && typeof process.env.GITHUB_REPOSITORY_OWNER !== 'string'
  ) {
    throw new Error('Organization mode enabled, but GitHub repository owner environment variable does not exist');
  }

  // GraphQL query.
  const query = {
    query: {
      [(isOrganization) ? 'organization' : 'viewer']: {
        ...(isOrganization) ? {
          __args: {
            login: process.env.GITHUB_REPOSITORY_OWNER,
          },
        } : {},
        sponsorshipsAsMaintainer: {
          __args: {
            first: 100,
            includePrivate: true,
            activeOnly: sponsorActiveOnly,
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
  };

  // Execute the GraphQL query.
  const octokit = github.getOctokit(githubPersonalAccessToken);
  const octokitResponse = await octokit.graphql(jsonToGraphQLQuery(query));
  const octokitResponsePath = (isOrganization) ? ['organization', 'sponsorshipsAsMaintainer'] : ['viewer', 'sponsorshipsAsMaintainer'];
  const sponsorships = _.get(octokitResponse, octokitResponsePath, {});
  const parsedSponsorships = sponsorshipsAsMaintainer.safeParse(sponsorships);

  // Stop if parsed sponsorships is not valid.
  if (!parsedSponsorships.success) {
    return results;
  }

  const { data } = parsedSponsorships;

  // Accumulate results.
  const newResults = [...results, ...data.nodes.map((node) => {
    const nodeSponsorEntityLogin = node.sponsorEntity?.login;
    const nodeTierMonthlyPriceInCents = node.tier?.monthlyPriceInCents;

    // Login username is required to match issue opener/commenter.
    if (
      nodeSponsorEntityLogin === undefined
      || nodeTierMonthlyPriceInCents === undefined
    ) {
      return null;
    }

    // Skip sponsors that do not meet the minimum requirement.
    if (nodeTierMonthlyPriceInCents < sponsorMinimum) {
      return null;
    }

    return {
      type: 'github-api' as 'github-api',
      login: nodeSponsorEntityLogin,
      amount: nodeTierMonthlyPriceInCents,
    };
  }).filter((node) => node !== null)];

  // Check if there are more pages.
  if (data.pageInfo.hasNextPage) {
    return getSponsors(
      config,
      data.pageInfo.endCursor,
      newResults,
    );
  }

  return newResults;
}

/**
 * Get sponsors exempt.
 *
 * @param {GetSponsorsExemptConfig} config - Config.
 *
 * @returns {GetSponsorsExemptReturns}
 *
 * @since 1.0.0
 */
export function getSponsorsExempt(config: GetSponsorsExemptConfig): GetSponsorsExemptReturns {
  const { sponsorExemptFileLocation } = config;

  try {
    const file = fs.readFileSync(path.resolve(sponsorExemptFileLocation), 'utf8');
    const exempts = file.split('\n');

    return exempts.map((exempt) => ({
      type: 'exempt-file' as 'exempt-file',
      login: exempt,
      amount: null,
    })).filter((exempt) => exempt.login !== '');
  } catch {
    core.debug(`"${sponsorExemptFileLocation}" not found. Skipping..."`);

    return [];
  }
}

/**
 * Lock issue.
 *
 * @param {LockIssueNodeId}  nodeId - Node id.
 * @param {LockIssueConfig}  config - Config.
 *
 * @returns {LockIssueReturns}
 *
 * @since 1.0.0
 */
export async function lockIssue(nodeId: LockIssueNodeId, config: LockIssueConfig): LockIssueReturns {
  const { githubWorkflowToken } = config;

  // GraphQL query.
  const query = {
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
  };

  const octokit = github.getOctokit(githubWorkflowToken);

  await octokit.graphql(jsonToGraphQLQuery(query));
}
