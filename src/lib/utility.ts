import * as core from '@actions/core';
import * as github from '@actions/github';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import _ from 'lodash';
import fs from 'node:fs';
import path from 'node:path';

import { configuration, sponsorshipsAsMaintainer } from '@/lib/schema.js';
import type {
  GetConfigReturns,
  GetContextReturns,
  GetSponsorsConfig,
  GetSponsorsCursor,
  GetSponsorsExemptConfig,
  GetSponsorsExemptReturns,
  GetSponsorsResults,
  GetSponsorsReturns,
} from '@/types/index.d.ts';

/**
 * Get config.
 *
 * @returns {GetConfigReturns}
 *
 * @since 1.0.0
 */
export function getConfig(): GetConfigReturns {
  const githubToken = core.getInput('GITHUB_TOKEN');
  const issueLabels = core.getInput('ISSUE_LABELS');
  const issueLimitCommenter = core.getInput('ISSUE_LIMIT_COMMENTER');
  const issueLockOnClose = core.getInput('ISSUE_LOCK_ON_CLOSE');
  const isOrganization = core.getInput('IS_ORGANIZATION');
  const sponsorActiveOnly = core.getInput('SPONSOR_ACTIVE_ONLY');
  const sponsorExemptFileLocation = core.getInput('SPONSOR_EXEMPT_FILE_LOCATION');
  const sponsorMinimum = core.getInput('SPONSOR_MINIMUM');

  return configuration.parse({
    githubToken,
    issueLabels,
    issueLimitCommenter,
    issueLockOnClose,
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
    activeOnly,
    githubToken,
    isOrganization,
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
            activeOnly,
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
  const octokit = github.getOctokit(githubToken);
  const octokitResponse = await octokit.graphql(jsonToGraphQLQuery(query));
  const octokitResponsePath = (isOrganization) ? ['organization', 'sponsorshipsAsMaintainer'] : ['viewer', 'sponsorshipsAsMaintainer'];
  const data = _.get(octokitResponse, octokitResponsePath, {});
  const parsedData = sponsorshipsAsMaintainer.safeParse(data);

  // Stop if parsed data is not valid.
  if (!parsedData.success) {
    return results;
  }

  // Accumulate results.
  const newResults = [...results, ...parsedData.data.nodes.map((node) => {
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
  if (parsedData.data.pageInfo.hasNextPage) {
    return getSponsors(
      config,
      parsedData.data.pageInfo.endCursor,
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
