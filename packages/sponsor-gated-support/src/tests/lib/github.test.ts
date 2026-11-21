import * as github from '@actions/github';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Runner as GithubAdapter } from '../../lib/github.js';

const mockGraphql = vi.fn();

const mockContext = vi.hoisted(() => ({
  eventName: 'issues',
  payload: { action: 'opened' },
}));

vi.mock('@actions/github', () => ({
  context: mockContext,
  getOctokit: vi.fn(() => ({
    graphql: mockGraphql,
  })),
}));

const baseConfig = {
  githubPersonalAccessToken: 'ghp_test123',
  githubWorkflowToken: 'ghs_test456',
  issueLabels: ['support'],
  issueLimitCommenter: true,
  issueLockOnClose: true,
  issueMessageNotSponsor: 'Not a sponsor.',
  issueMessageWelcome: 'Welcome!',
  isOrganization: false,
  sponsorActiveOnly: true,
  sponsorExemptFileLocation: './SPONSOR_EXEMPT',
  sponsorMinimum: 0,
};

const supportLabel = {
  color: 'fc0',
  default: false,
  description: null,
  id: 1,
  name: 'support',
  node_id: 'LA_abc',
  url: 'https://api.github.com/labels/support',
};

const baseCommentPayload = {
  action: 'created',
  comment: {
    author_association: 'NONE',
    node_id: 'IC_abc123',
    user: { login: 'outsider' },
  },
  issue: {
    labels: [supportLabel],
    user: { login: 'issueOwner' },
  },
};

const baseIssuePayload = {
  action: 'opened',
  issue: {
    author_association: 'NONE',
    labels: [supportLabel],
    locked: false,
    node_id: 'I_abc123',
    user: { login: 'testUser' },
  },
};

const savedEnv = process.env['GITHUB_REPOSITORY_OWNER'];

beforeEach(() => {
  vi.clearAllMocks();

  mockGraphql.mockReset();

  Reflect.deleteProperty(process.env, 'GITHUB_REPOSITORY_OWNER');

  return;
});

afterEach(() => {
  if (savedEnv !== undefined) {
    Reflect.set(process.env, 'GITHUB_REPOSITORY_OWNER', savedEnv);
  } else {
    Reflect.deleteProperty(process.env, 'GITHUB_REPOSITORY_OWNER');
  }

  return;
});

/**
 * Tests - Lib - GitHub - Mutations.
 *
 * @since 2.0.13
 */
describe('mutations', () => {
  it('adds an issue comment with the workflow token', async () => {
    mockGraphql.mockResolvedValueOnce({});

    await new GithubAdapter(baseConfig).addIssueComment('I_abc123', 'Welcome!');

    expect(github.getOctokit).toHaveBeenCalledWith('ghs_test456');

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('addComment'));

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('subjectId: "I_abc123"'));

    return;
  });

  it('closes an issue with the workflow token', async () => {
    mockGraphql.mockResolvedValueOnce({});

    await new GithubAdapter(baseConfig).closeIssue('I_abc123');

    expect(github.getOctokit).toHaveBeenCalledWith('ghs_test456');

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('closeIssue'));

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('issueId: "I_abc123"'));

    return;
  });

  it('deletes an issue comment with the workflow token', async () => {
    mockGraphql.mockResolvedValueOnce({});

    await new GithubAdapter(baseConfig).deleteIssueComment('IC_abc123');

    expect(github.getOctokit).toHaveBeenCalledWith('ghs_test456');

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('deleteIssueComment'));

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('id: "IC_abc123"'));

    return;
  });

  it('locks an issue with the workflow token', async () => {
    mockGraphql.mockResolvedValueOnce({});

    await new GithubAdapter(baseConfig).lockIssue('I_abc123');

    expect(github.getOctokit).toHaveBeenCalledWith('ghs_test456');

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('lockLockable'));

    expect(mockGraphql).toHaveBeenCalledWith(expect.stringContaining('lockableId: "I_abc123"'));

    return;
  });

  it('lets mutation errors bubble up', async () => {
    mockGraphql.mockRejectedValueOnce(new Error('GraphQL error'));

    await expect(new GithubAdapter(baseConfig).lockIssue('I_abc123')).rejects.toThrow('GraphQL error');

    return;
  });

  return;
});

/**
 * Tests - Lib - GitHub - Get Context.
 *
 * @since 2.0.13
 */
describe('getContext', () => {
  it('returns the workflow context', () => {
    expect(new GithubAdapter(baseConfig).getContext()).toBe(mockContext);

    return;
  });

  return;
});

/**
 * Tests - Lib - GitHub - Parse Issue Comment Event.
 *
 * @since 2.0.13
 */
describe('parseIssueCommentEvent', () => {
  it('reports an empty payload', () => {
    expect(new GithubAdapter(baseConfig).parseIssueCommentEvent({})).toStrictEqual({ status: 'empty' });

    return;
  });

  it('reports a structurally invalid payload', () => {
    expect(new GithubAdapter(baseConfig).parseIssueCommentEvent({
      action: 'created',
      comment: 'not-an-object',
    })).toStrictEqual({ status: 'invalid' });

    return;
  });

  it('maps a valid payload into the project event', () => {
    expect(new GithubAdapter(baseConfig).parseIssueCommentEvent(baseCommentPayload)).toStrictEqual({
      status: 'valid',
      event: {
        action: 'created',
        comment: {
          authorLogin: 'outsider',
          authorRole: 'other',
          id: 'IC_abc123',
        },
        issue: {
          authorLogin: 'issueOwner',
          labelNames: ['support'],
        },
      },
    });

    return;
  });

  it('maps missing users to null logins', () => {
    expect(new GithubAdapter(baseConfig).parseIssueCommentEvent({
      ...baseCommentPayload,
      comment: {
        ...baseCommentPayload['comment'],
        user: null,
      },
      issue: {
        ...baseCommentPayload['issue'],
        user: null,
      },
    })).toMatchObject({
      status: 'valid',
      event: {
        comment: { authorLogin: null },
        issue: { authorLogin: null },
      },
    });

    return;
  });

  it.each([
    [
      'COLLABORATOR',
      'collaborator',
    ],
    [
      'CONTRIBUTOR',
      'contributor',
    ],
    [
      'FIRST_TIMER',
      'other',
    ],
    [
      'FIRST_TIME_CONTRIBUTOR',
      'other',
    ],
    [
      'MANNEQUIN',
      'other',
    ],
    [
      'MEMBER',
      'member',
    ],
    [
      'NONE',
      'other',
    ],
    [
      'OWNER',
      'owner',
    ],
  ])('maps the author association to a project role', (authorAssociation, authorRole) => {
    expect(new GithubAdapter(baseConfig).parseIssueCommentEvent({
      ...baseCommentPayload,
      comment: {
        ...baseCommentPayload['comment'],
        author_association: authorAssociation,
      },
    })).toMatchObject({
      status: 'valid',
      event: {
        comment: { authorRole },
      },
    });

    return;
  });

  return;
});

/**
 * Tests - Lib - GitHub - Parse Issues Event.
 *
 * @since 2.0.13
 */
describe('parseIssuesEvent', () => {
  it('reports an empty payload', () => {
    expect(new GithubAdapter(baseConfig).parseIssuesEvent({})).toStrictEqual({ status: 'empty' });

    return;
  });

  it('reports a payload with an unknown action as invalid', () => {
    expect(new GithubAdapter(baseConfig).parseIssuesEvent({
      ...baseIssuePayload,
      action: 'not-a-real-action',
    })).toStrictEqual({ status: 'invalid' });

    return;
  });

  it('maps a valid payload into the project event', () => {
    expect(new GithubAdapter(baseConfig).parseIssuesEvent({
      ...baseIssuePayload,
      issue: {
        ...baseIssuePayload['issue'],
        author_association: 'MEMBER',
        locked: true,
      },
    })).toStrictEqual({
      status: 'valid',
      event: {
        action: 'opened',
        issue: {
          authorLogin: 'testUser',
          authorRole: 'member',
          id: 'I_abc123',
          labelNames: ['support'],
          locked: true,
        },
      },
    });

    return;
  });

  it('maps a missing user to a null login', () => {
    expect(new GithubAdapter(baseConfig).parseIssuesEvent({
      ...baseIssuePayload,
      issue: {
        ...baseIssuePayload['issue'],
        user: null,
      },
    })).toMatchObject({
      status: 'valid',
      event: {
        issue: { authorLogin: null },
      },
    });

    return;
  });

  return;
});

/**
 * Tests - Lib - GitHub - Get Sponsors.
 *
 * @since 1.0.1
 */
describe('getSponsors', () => {
  it('returns sponsors from a single-page viewer response', async () => {
    mockGraphql.mockResolvedValueOnce({
      viewer: {
        sponsorshipsAsMaintainer: {
          nodes: [{
            sponsorEntity: { login: 'sponsor1' },
            tier: { monthlyPriceInCents: 500 },
          }],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          totalCount: 1,
        },
      },
    });

    await expect(new GithubAdapter(baseConfig).getSponsors()).resolves.toStrictEqual([{
      type: 'github-api',
      login: 'sponsor1',
      amount: 500,
    }]);

    expect(github.getOctokit).toHaveBeenCalledWith('ghp_test123');

    return;
  });

  it('returns sponsors from organization mode', async () => {
    Reflect.set(process.env, 'GITHUB_REPOSITORY_OWNER', 'test-org');

    mockGraphql.mockResolvedValueOnce({
      organization: {
        sponsorshipsAsMaintainer: {
          nodes: [{
            sponsorEntity: { login: 'orgSponsor' },
            tier: { monthlyPriceInCents: 1000 },
          }],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          totalCount: 1,
        },
      },
    });

    await expect(new GithubAdapter({
      ...baseConfig,
      isOrganization: true,
    }).getSponsors()).resolves.toStrictEqual([{
      type: 'github-api',
      login: 'orgSponsor',
      amount: 1000,
    }]);

    return;
  });

  it('throws when organization mode is enabled without GITHUB_REPOSITORY_OWNER', async () => {
    await expect(new GithubAdapter({
      ...baseConfig,
      isOrganization: true,
    }).getSponsors()).rejects.toThrow('Organization mode enabled, but GitHub repository owner environment variable does not exist');

    return;
  });

  it('paginates through multiple pages', async () => {
    mockGraphql
      .mockResolvedValueOnce({
        viewer: {
          sponsorshipsAsMaintainer: {
            nodes: [{
              sponsorEntity: { login: 'sponsor1' },
              tier: { monthlyPriceInCents: 500 },
            }],
            pageInfo: {
              endCursor: 'cursor1',
              hasNextPage: true,
            },
            totalCount: 2,
          },
        },
      })
      .mockResolvedValueOnce({
        viewer: {
          sponsorshipsAsMaintainer: {
            nodes: [{
              sponsorEntity: { login: 'sponsor2' },
              tier: { monthlyPriceInCents: 1000 },
            }],
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
            totalCount: 2,
          },
        },
      });

    await expect(new GithubAdapter(baseConfig).getSponsors()).resolves.toStrictEqual([
      {
        type: 'github-api',
        login: 'sponsor1',
        amount: 500,
      },
      {
        type: 'github-api',
        login: 'sponsor2',
        amount: 1000,
      },
    ]);

    expect(mockGraphql).toHaveBeenCalledTimes(2);

    expect(mockGraphql).toHaveBeenLastCalledWith(expect.stringContaining('after: "cursor1"'));

    return;
  });

  it('filters out sponsors below minimum amount', async () => {
    mockGraphql.mockResolvedValueOnce({
      viewer: {
        sponsorshipsAsMaintainer: {
          nodes: [
            {
              sponsorEntity: { login: 'lowSponsor' },
              tier: { monthlyPriceInCents: 100 },
            },
            {
              sponsorEntity: { login: 'highSponsor' },
              tier: { monthlyPriceInCents: 500 },
            },
          ],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          totalCount: 2,
        },
      },
    });

    await expect(new GithubAdapter({
      ...baseConfig,
      sponsorMinimum: 200,
    }).getSponsors()).resolves.toStrictEqual([{
      type: 'github-api',
      login: 'highSponsor',
      amount: 500,
    }]);

    return;
  });

  it('skips sponsors with null sponsorEntity', async () => {
    mockGraphql.mockResolvedValueOnce({
      viewer: {
        sponsorshipsAsMaintainer: {
          nodes: [{
            sponsorEntity: null,
            tier: { monthlyPriceInCents: 500 },
          }],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          totalCount: 1,
        },
      },
    });

    await expect(new GithubAdapter(baseConfig).getSponsors()).resolves.toStrictEqual([]);

    return;
  });

  it('skips sponsors with null tier', async () => {
    mockGraphql.mockResolvedValueOnce({
      viewer: {
        sponsorshipsAsMaintainer: {
          nodes: [{
            sponsorEntity: { login: 'sponsor1' },
            tier: null,
          }],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          totalCount: 1,
        },
      },
    });

    await expect(new GithubAdapter(baseConfig).getSponsors()).resolves.toStrictEqual([]);

    return;
  });

  it('throws on invalid sponsorship response', async () => {
    mockGraphql.mockResolvedValueOnce({});

    await expect(new GithubAdapter(baseConfig).getSponsors()).rejects.toThrow('There was an error retrieving sponsorships');

    return;
  });

  it('returns empty array when no sponsors exist', async () => {
    mockGraphql.mockResolvedValueOnce({
      viewer: {
        sponsorshipsAsMaintainer: {
          nodes: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          totalCount: 0,
        },
      },
    });

    await expect(new GithubAdapter(baseConfig).getSponsors()).resolves.toStrictEqual([]);

    return;
  });

  return;
});
