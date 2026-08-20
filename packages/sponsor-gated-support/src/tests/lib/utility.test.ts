import * as github from '@actions/github';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getSponsors } from '../../lib/utility.js';

const mockGraphql = vi.fn();

vi.mock('@actions/github', () => ({
  getOctokit: vi.fn(() => ({
    graphql: mockGraphql,
  })),
}));

vi.mock('@actions/core', () => ({
  debug: vi.fn(),
  info: vi.fn(),
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

const savedEnv = process.env['GITHUB_REPOSITORY_OWNER'];

beforeEach(() => {
  vi.clearAllMocks();

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
 * Tests - Lib - Utility - Get Sponsors.
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

    await expect(getSponsors(baseConfig)).resolves.toStrictEqual([{
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

    await expect(getSponsors({
      ...baseConfig,
      isOrganization: true,
    })).resolves.toStrictEqual([{
      type: 'github-api',
      login: 'orgSponsor',
      amount: 1000,
    }]);

    return;
  });

  it('throws when organization mode is enabled without GITHUB_REPOSITORY_OWNER', async () => {
    await expect(getSponsors({
      ...baseConfig,
      isOrganization: true,
    })).rejects.toThrow('Organization mode enabled, but GitHub repository owner environment variable does not exist');

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

    await expect(getSponsors(baseConfig)).resolves.toStrictEqual([
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

    await expect(getSponsors({
      ...baseConfig,
      sponsorMinimum: 200,
    })).resolves.toStrictEqual([{
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

    await expect(getSponsors(baseConfig)).resolves.toStrictEqual([]);

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

    await expect(getSponsors(baseConfig)).resolves.toStrictEqual([]);

    return;
  });

  it('throws on invalid sponsorship response', async () => {
    mockGraphql.mockResolvedValueOnce({});

    await expect(getSponsors(baseConfig)).rejects.toThrow('There was an error retrieving sponsorships');

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

    await expect(getSponsors(baseConfig)).resolves.toStrictEqual([]);

    return;
  });

  return;
});
