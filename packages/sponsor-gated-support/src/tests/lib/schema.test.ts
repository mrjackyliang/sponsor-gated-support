import { describe, expect, it } from 'vitest';

import {
  configuration,
  issueCommentPayload,
  issuesPayload,
  sponsorshipsAsMaintainer,
} from '../../lib/schema.js';

const baseInput = {
  githubPersonalAccessToken: 'ghp_example',
  githubWorkflowToken: 'ghs_example',
  issueLabels: 'support',
  issueLimitCommenter: 'true',
  issueLockOnClose: 'true',
  issueMessageNotSponsor: '',
  issueMessageWelcome: '',
  isOrganization: 'false',
  sponsorActiveOnly: 'true',
  sponsorExemptFileLocation: './SPONSOR_EXEMPT',
  sponsorMinimum: '0',
};

/**
 * Tests - Lib - Schema - Configuration.
 *
 * @since 1.0.1
 */
describe('configuration', () => {
  it('applies the default label when issue labels is empty', () => {
    expect(configuration.parse({
      ...baseInput,
      issueLabels: '',
    })['issueLabels']).toStrictEqual(['support']);

    return;
  });

  it('splits the issue labels on commas', () => {
    expect(configuration.parse({
      ...baseInput,
      issueLabels: 'alpha,beta',
    })['issueLabels']).toStrictEqual([
      'alpha',
      'beta',
    ]);

    return;
  });

  it('coerces the boolean string inputs', () => {
    expect(configuration.parse({
      ...baseInput,
      issueLimitCommenter: 'true',
    })['issueLimitCommenter']).toBe(true);

    return;
  });

  it('coerces the sponsor minimum into a number', () => {
    expect(configuration.parse({
      ...baseInput,
      sponsorMinimum: '250',
    })['sponsorMinimum']).toBe(250);

    return;
  });

  it('rejects a personal access token without the ghp_ prefix', () => {
    expect(configuration.safeParse({
      ...baseInput,
      githubPersonalAccessToken: 'invalid',
    })['success']).toBe(false);

    return;
  });

  it('rejects a workflow token without the ghs_ prefix', () => {
    expect(configuration.safeParse({
      ...baseInput,
      githubWorkflowToken: 'invalid',
    })['success']).toBe(false);

    return;
  });

  it('trims whitespace from comma-separated issue labels', () => {
    expect(configuration.parse({
      ...baseInput,
      issueLabels: 'alpha, beta , gamma',
    })['issueLabels']).toStrictEqual([
      'alpha',
      'beta',
      'gamma',
    ]);

    return;
  });

  it('filters empty entries from trailing commas in issue labels', () => {
    expect(configuration.parse({
      ...baseInput,
      issueLabels: 'alpha,beta,',
    })['issueLabels']).toStrictEqual([
      'alpha',
      'beta',
    ]);

    return;
  });

  it('coerces empty sponsor minimum to zero', () => {
    expect(configuration.parse({
      ...baseInput,
      sponsorMinimum: '',
    })['sponsorMinimum']).toBe(0);

    return;
  });

  return;
});

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
    user: { login: 'commenter' },
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

const baseSponsorships = {
  nodes: [{
    sponsorEntity: { login: 'sponsor1' },
    tier: { monthlyPriceInCents: 500 },
  }],
  pageInfo: {
    endCursor: null,
    hasNextPage: false,
  },
  totalCount: 1,
};

/**
 * Tests - Lib - Schema - Issue Comment Payload.
 *
 * @since 1.0.1
 */
describe('issueCommentPayload', () => {
  it('parses a valid issue comment payload', () => {
    expect(issueCommentPayload.safeParse(baseCommentPayload)['success']).toBe(true);

    return;
  });

  it('accepts nullable user fields', () => {
    expect(issueCommentPayload.safeParse({
      ...baseCommentPayload,
      comment: {
        ...baseCommentPayload['comment'],
        user: null,
      },
    })['success']).toBe(true);

    return;
  });

  it('rejects a payload missing the comment node_id', () => {
    expect(issueCommentPayload.safeParse({
      ...baseCommentPayload,
      comment: {
        author_association: 'NONE',
        user: { login: 'commenter' },
      },
    })['success']).toBe(false);

    return;
  });

  return;
});

/**
 * Tests - Lib - Schema - Issues Payload.
 *
 * @since 1.0.1
 */
describe('issuesPayload', () => {
  it('parses a valid issues payload', () => {
    expect(issuesPayload.safeParse(baseIssuePayload)['success']).toBe(true);

    return;
  });

  it('accepts nullable issue user', () => {
    expect(issuesPayload.safeParse({
      ...baseIssuePayload,
      issue: {
        ...baseIssuePayload['issue'],
        user: null,
      },
    })['success']).toBe(true);

    return;
  });

  it('rejects a payload missing the issue node_id', () => {
    expect(issuesPayload.safeParse({
      ...baseIssuePayload,
      issue: {
        author_association: 'NONE',
        labels: [],
        locked: false,
        user: { login: 'testUser' },
      },
    })['success']).toBe(false);

    return;
  });

  return;
});

/**
 * Tests - Lib - Schema - Sponsorships As Maintainer.
 *
 * @since 1.0.1
 */
describe('sponsorshipsAsMaintainer', () => {
  it('parses a valid sponsorships response', () => {
    expect(sponsorshipsAsMaintainer.safeParse(baseSponsorships)['success']).toBe(true);

    return;
  });

  it('accepts nullable sponsorEntity and tier', () => {
    expect(sponsorshipsAsMaintainer.safeParse({
      ...baseSponsorships,
      nodes: [{
        sponsorEntity: null,
        tier: null,
      }],
    })['success']).toBe(true);

    return;
  });

  it('rejects a response missing pageInfo', () => {
    expect(sponsorshipsAsMaintainer.safeParse({
      nodes: [],
      totalCount: 0,
    })['success']).toBe(false);

    return;
  });

  return;
});
