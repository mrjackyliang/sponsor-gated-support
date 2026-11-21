import * as github from '@actions/github';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import _ from 'lodash';

import {
  issueCommentPayload,
  issuesPayload,
  sponsorshipsAsMaintainer,
} from './schema.js';

import type {
  Lib_Github_Runner_AddIssueComment_Body,
  Lib_Github_Runner_AddIssueComment_IssueId,
  Lib_Github_Runner_AddIssueComment_Returns,
  Lib_Github_Runner_CloseIssue_IssueId,
  Lib_Github_Runner_CloseIssue_Returns,
  Lib_Github_Runner_Config,
  Lib_Github_Runner_Constructor_Config,
  Lib_Github_Runner_DeleteIssueComment_CommentId,
  Lib_Github_Runner_DeleteIssueComment_Returns,
  Lib_Github_Runner_FetchSponsors_Cursor,
  Lib_Github_Runner_FetchSponsors_Data,
  Lib_Github_Runner_FetchSponsors_NewResults,
  Lib_Github_Runner_FetchSponsors_OctokitResponse,
  Lib_Github_Runner_FetchSponsors_OctokitResponsePath,
  Lib_Github_Runner_FetchSponsors_OctokitResponseRoot,
  Lib_Github_Runner_FetchSponsors_ParsedSponsorships,
  Lib_Github_Runner_FetchSponsors_Results,
  Lib_Github_Runner_FetchSponsors_Returns,
  Lib_Github_Runner_FetchSponsors_Sponsorships,
  Lib_Github_Runner_GetContext_Returns,
  Lib_Github_Runner_GetSponsors_Returns,
  Lib_Github_Runner_LockIssue_IssueId,
  Lib_Github_Runner_LockIssue_Returns,
  Lib_Github_Runner_ParseIssueCommentEvent_Data,
  Lib_Github_Runner_ParseIssueCommentEvent_ParsedPayload,
  Lib_Github_Runner_ParseIssueCommentEvent_Payload,
  Lib_Github_Runner_ParseIssueCommentEvent_Returns,
  Lib_Github_Runner_ParseIssuesEvent_Data,
  Lib_Github_Runner_ParseIssuesEvent_ParsedPayload,
  Lib_Github_Runner_ParseIssuesEvent_Payload,
  Lib_Github_Runner_ParseIssuesEvent_Returns,
  Lib_Github_Runner_ToAuthorRole_AuthorAssociation,
  Lib_Github_Runner_ToAuthorRole_Returns,
} from '../types/lib/github.d.ts';

/**
 * Lib - GitHub.
 *
 * The only module that talks to GitHub. It runs the Octokit GraphQL calls and
 * turns webhook payloads into project-owned events, so upstream API changes
 * stay here and tests can hand core logic a fake with the same shape.
 *
 * @since 2.0.13
 */
export class Runner {
  /**
   * Lib - GitHub - Config.
   *
   * Parsed action configuration holding the tokens and sponsor settings that
   * every GitHub call reads. Set once by the constructor.
   *
   * @private
   *
   * @since 2.0.13
   */
  readonly #config: Lib_Github_Runner_Config;

  /**
   * Lib - GitHub - Constructor.
   *
   * Stores the parsed configuration so each call can pick the right token:
   * the personal access token for sponsors, the workflow token for mutations.
   *
   * @param {Lib_Github_Runner_Constructor_Config} config - Config.
   *
   * @since 2.0.13
   */
  public constructor(config: Lib_Github_Runner_Constructor_Config) {
    this.#config = config;

    return;
  }

  /**
   * Lib - GitHub - Add Issue Comment.
   *
   * Adds a comment to the target issue using the workflow token,
   * executing the mutation through the GitHub GraphQL API.
   *
   * @param {Lib_Github_Runner_AddIssueComment_IssueId} issueId - Issue id.
   * @param {Lib_Github_Runner_AddIssueComment_Body}    body    - Body.
   *
   * @returns {Lib_Github_Runner_AddIssueComment_Returns}
   *
   * @since 2.0.13
   */
  public async addIssueComment(issueId: Lib_Github_Runner_AddIssueComment_IssueId, body: Lib_Github_Runner_AddIssueComment_Body): Lib_Github_Runner_AddIssueComment_Returns {
    await github.getOctokit(this.#config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
      mutation: {
        addComment: {
          __args: {
            input: {
              subjectId: issueId,
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
   * Lib - GitHub - Close Issue.
   *
   * Closes the target issue using the workflow token, executing the
   * mutation through the GitHub GraphQL API.
   *
   * @param {Lib_Github_Runner_CloseIssue_IssueId} issueId - Issue id.
   *
   * @returns {Lib_Github_Runner_CloseIssue_Returns}
   *
   * @since 2.0.13
   */
  public async closeIssue(issueId: Lib_Github_Runner_CloseIssue_IssueId): Lib_Github_Runner_CloseIssue_Returns {
    await github.getOctokit(this.#config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
      mutation: {
        closeIssue: {
          __args: {
            input: {
              issueId,
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
   * Lib - GitHub - Delete Issue Comment.
   *
   * Deletes the target issue comment using the workflow token,
   * executing the mutation through the GitHub GraphQL API.
   *
   * @param {Lib_Github_Runner_DeleteIssueComment_CommentId} commentId - Comment id.
   *
   * @returns {Lib_Github_Runner_DeleteIssueComment_Returns}
   *
   * @since 2.0.13
   */
  public async deleteIssueComment(commentId: Lib_Github_Runner_DeleteIssueComment_CommentId): Lib_Github_Runner_DeleteIssueComment_Returns {
    await github.getOctokit(this.#config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
      mutation: {
        deleteIssueComment: {
          __args: {
            input: {
              id: commentId,
            },
          },
          clientMutationId: true,
        },
      },
    }));

    return;
  }

  /**
   * Lib - GitHub - Get Context.
   *
   * Returns the GitHub Actions context describing the event and
   * repository that triggered the current workflow run.
   *
   * @returns {Lib_Github_Runner_GetContext_Returns}
   *
   * @since 2.0.13
   */
  public getContext(): Lib_Github_Runner_GetContext_Returns {
    return github.context;
  }

  /**
   * Lib - GitHub - Get Sponsors.
   *
   * Fetches every sponsor from the GitHub GraphQL API, starting at the
   * first page and filtering out those below the minimum tier.
   *
   * @returns {Lib_Github_Runner_GetSponsors_Returns}
   *
   * @since 2.0.13
   */
  public async getSponsors(): Lib_Github_Runner_GetSponsors_Returns {
    return this.fetchSponsors(null, []);
  }

  /**
   * Lib - GitHub - Lock Issue.
   *
   * Locks the target issue using the workflow token, preventing
   * further comments through the GitHub GraphQL API.
   *
   * @param {Lib_Github_Runner_LockIssue_IssueId} issueId - Issue id.
   *
   * @returns {Lib_Github_Runner_LockIssue_Returns}
   *
   * @since 2.0.13
   */
  public async lockIssue(issueId: Lib_Github_Runner_LockIssue_IssueId): Lib_Github_Runner_LockIssue_Returns {
    await github.getOctokit(this.#config['githubWorkflowToken']).graphql(jsonToGraphQLQuery({
      mutation: {
        lockLockable: {
          __args: {
            input: {
              lockableId: issueId,
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

  /**
   * Lib - GitHub - Parse Issue Comment Event.
   *
   * Validates an "issue_comment" webhook payload and maps it into the
   * project-owned event, reporting empty and invalid payloads apart.
   *
   * @param {Lib_Github_Runner_ParseIssueCommentEvent_Payload} payload - Payload.
   *
   * @returns {Lib_Github_Runner_ParseIssueCommentEvent_Returns}
   *
   * @since 2.0.13
   */
  public parseIssueCommentEvent(payload: Lib_Github_Runner_ParseIssueCommentEvent_Payload): Lib_Github_Runner_ParseIssueCommentEvent_Returns {
    if (_.isEmpty(payload) === true) {
      return {
        status: 'empty',
      };
    }

    const parsedPayload: Lib_Github_Runner_ParseIssueCommentEvent_ParsedPayload = issueCommentPayload.safeParse(payload);

    if (parsedPayload.success === false) {
      return {
        status: 'invalid',
      };
    }

    const data: Lib_Github_Runner_ParseIssueCommentEvent_Data = parsedPayload.data;

    return {
      status: 'valid',
      event: {
        action: data['action'],
        comment: {
          authorLogin: (data['comment']['user'] !== null) ? data['comment']['user']['login'] : null,
          authorRole: Runner.toAuthorRole(data['comment']['author_association']),
          id: data['comment']['node_id'],
        },
        issue: {
          authorLogin: (data['issue']['user'] !== null) ? data['issue']['user']['login'] : null,
          labelNames: data['issue']['labels'].map((label) => label['name']),
        },
      },
    };
  }

  /**
   * Lib - GitHub - Parse Issues Event.
   *
   * Validates an "issues" webhook payload and maps it into the
   * project-owned event, reporting empty and invalid payloads apart.
   *
   * @param {Lib_Github_Runner_ParseIssuesEvent_Payload} payload - Payload.
   *
   * @returns {Lib_Github_Runner_ParseIssuesEvent_Returns}
   *
   * @since 2.0.13
   */
  public parseIssuesEvent(payload: Lib_Github_Runner_ParseIssuesEvent_Payload): Lib_Github_Runner_ParseIssuesEvent_Returns {
    if (_.isEmpty(payload) === true) {
      return {
        status: 'empty',
      };
    }

    const parsedPayload: Lib_Github_Runner_ParseIssuesEvent_ParsedPayload = issuesPayload.safeParse(payload);

    if (parsedPayload.success === false) {
      return {
        status: 'invalid',
      };
    }

    const data: Lib_Github_Runner_ParseIssuesEvent_Data = parsedPayload.data;

    return {
      status: 'valid',
      event: {
        action: data['action'],
        issue: {
          authorLogin: (data['issue']['user'] !== null) ? data['issue']['user']['login'] : null,
          authorRole: Runner.toAuthorRole(data['issue']['author_association']),
          id: data['issue']['node_id'],
          labelNames: data['issue']['labels'].map((label) => label['name']),
          locked: data['issue']['locked'],
        },
      },
    };
  }

  /**
   * Lib - GitHub - Fetch Sponsors.
   *
   * Recursively fetches one page of sponsors from the GitHub GraphQL API,
   * paginating and filtering out those below the minimum tier.
   *
   * @param {Lib_Github_Runner_FetchSponsors_Cursor}  cursor  - Cursor.
   * @param {Lib_Github_Runner_FetchSponsors_Results} results - Results.
   *
   * @private
   *
   * @returns {Lib_Github_Runner_FetchSponsors_Returns}
   *
   * @since 2.0.13
   */
  private async fetchSponsors(cursor: Lib_Github_Runner_FetchSponsors_Cursor, results: Lib_Github_Runner_FetchSponsors_Results): Lib_Github_Runner_FetchSponsors_Returns {
    if (
      this.#config['isOrganization'] === true
      && typeof process.env['GITHUB_REPOSITORY_OWNER'] !== 'string'
    ) {
      throw new Error('Organization mode enabled, but GitHub repository owner environment variable does not exist');
    }

    const octokitResponseRoot: Lib_Github_Runner_FetchSponsors_OctokitResponseRoot = (this.#config['isOrganization'] === true) ? 'organization' : 'viewer';
    const octokitResponse: Lib_Github_Runner_FetchSponsors_OctokitResponse = await github.getOctokit(this.#config['githubPersonalAccessToken']).graphql(jsonToGraphQLQuery({
      query: {
        [octokitResponseRoot]: {
          ...(this.#config['isOrganization'] === true) ? { __args: { login: process.env['GITHUB_REPOSITORY_OWNER'] } } : {},
          sponsorshipsAsMaintainer: {
            __args: {
              first: 100,
              includePrivate: true,
              activeOnly: this.#config['sponsorActiveOnly'],
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
    const octokitResponsePath: Lib_Github_Runner_FetchSponsors_OctokitResponsePath = [
      octokitResponseRoot,
      'sponsorshipsAsMaintainer',
    ];
    const sponsorships: Lib_Github_Runner_FetchSponsors_Sponsorships = _.get(octokitResponse, octokitResponsePath, {});
    const parsedSponsorships: Lib_Github_Runner_FetchSponsors_ParsedSponsorships = sponsorshipsAsMaintainer.safeParse(sponsorships);

    // Stop if parsed sponsorships is not valid.
    if (parsedSponsorships.success === false) {
      throw new Error('There was an error retrieving sponsorships');
    }

    const data: Lib_Github_Runner_FetchSponsors_Data = parsedSponsorships.data;

    // Accumulate results.
    const newResults: Lib_Github_Runner_FetchSponsors_NewResults = [
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
        if (node['tier']['monthlyPriceInCents'] < this.#config['sponsorMinimum']) {
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
      return this.fetchSponsors(
        data['pageInfo']['endCursor'],
        newResults,
      );
    }

    return newResults;
  }

  /**
   * Lib - GitHub - To Author Role.
   *
   * Maps GitHub's author association onto the project-owned author role, so
   * core logic never compares GitHub enum values such as "MEMBER" directly.
   *
   * @param {Lib_Github_Runner_ToAuthorRole_AuthorAssociation} authorAssociation - Author association.
   *
   * @private
   *
   * @returns {Lib_Github_Runner_ToAuthorRole_Returns}
   *
   * @since 2.0.13
   */
  private static toAuthorRole(authorAssociation: Lib_Github_Runner_ToAuthorRole_AuthorAssociation): Lib_Github_Runner_ToAuthorRole_Returns {
    switch (authorAssociation) {
      case 'COLLABORATOR': {
        return 'collaborator';
      }

      case 'CONTRIBUTOR': {
        return 'contributor';
      }

      case 'MEMBER': {
        return 'member';
      }

      case 'OWNER': {
        return 'owner';
      }

      default: {
        return 'other';
      }
    }
  }
}
