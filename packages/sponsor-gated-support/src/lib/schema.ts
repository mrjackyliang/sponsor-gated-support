import { z } from 'zod';

/**
 * Lib - Schema - Configuration.
 *
 * Validates and normalizes the raw action inputs, applying defaults
 * and coercing string inputs into their typed configuration values.
 *
 * @since 1.0.1
 */
export const configuration = z.object({
  githubPersonalAccessToken: z.string()
    .startsWith('ghp_'),
  githubWorkflowToken: z.string()
    .startsWith('ghs_'),
  issueLabels: z.string()
    .transform((value) => ((value === '') ? 'support' : value))
    .transform((value) => value.split(',').map((v) => v.trim()))
    .transform((value) => value.filter((v) => v !== '')),
  issueLimitCommenter: z.enum([
    'true',
    'false',
  ])
    .transform((value) => value === 'true'),
  issueLockOnClose: z.enum([
    'true',
    'false',
  ])
    .transform((value) => value === 'true'),
  issueMessageNotSponsor: z.string()
    .transform((value) => ((value === '') ? 'Apologies! Only sponsoring users are allowed to open issues. Please sponsor the owner of this repository, then try again.' : value)),
  issueMessageWelcome: z.string()
    .transform((value) => ((value === '') ? 'Thank you for your support! We appreciate your sponsorship and are here to help. We will review your issue and get back to you as soon as possible.' : value)),
  isOrganization: z.enum([
    'true',
    'false',
  ])
    .transform((value) => value === 'true'),
  sponsorActiveOnly: z.enum([
    'true',
    'false',
  ])
    .transform((value) => value === 'true'),
  sponsorExemptFileLocation: z.string()
    .transform((value) => ((value === '') ? './SPONSOR_EXEMPT' : value)),
  sponsorMinimum: z.number({
    coerce: true,
  }),
});

/**
 * Lib - Schema - Issue Comment Payload.
 *
 * Validates the subset of the "issue_comment" webhook payload that
 * the action reads when moderating comments on gated issues.
 *
 * @since 1.0.1
 */
export const issueCommentPayload = z.object({
  action: z.union([
    z.literal('created'),
    z.literal('deleted'),
    z.literal('edited'),
  ]),
  comment: z.object({
    author_association: z.union([
      z.literal('COLLABORATOR'),
      z.literal('CONTRIBUTOR'),
      z.literal('FIRST_TIMER'),
      z.literal('FIRST_TIME_CONTRIBUTOR'),
      z.literal('MANNEQUIN'),
      z.literal('MEMBER'),
      z.literal('NONE'),
      z.literal('OWNER'),
    ]),
    node_id: z.string(),
    user: z.object({
      login: z.string(),
    }).nullable(),
  }),
  issue: z.object({
    labels: z.array(z.object({
      color: z.string(),
      default: z.boolean(),
      description: z.string().nullable(),
      id: z.number(),
      name: z.string(),
      node_id: z.string(),
      url: z.string(),
    })),
    user: z.object({
      login: z.string(),
    }).nullable(),
  }),
});

/**
 * Lib - Schema - Issues Payload.
 *
 * Validates the subset of the "issues" webhook payload that the
 * action reads when gating and moderating opened or closed issues.
 *
 * @since 1.0.1
 */
export const issuesPayload = z.object({
  action: z.union([
    z.literal('assigned'),
    z.literal('closed'),
    z.literal('deleted'),
    z.literal('demilestoned'),
    z.literal('edited'),
    z.literal('labeled'),
    z.literal('locked'),
    z.literal('milestoned'),
    z.literal('opened'),
    z.literal('pinned'),
    z.literal('reopened'),
    z.literal('transferred'),
    z.literal('unassigned'),
    z.literal('unlabeled'),
    z.literal('unlocked'),
    z.literal('unpinned'),
  ]),
  issue: z.object({
    author_association: z.union([
      z.literal('COLLABORATOR'),
      z.literal('CONTRIBUTOR'),
      z.literal('FIRST_TIMER'),
      z.literal('FIRST_TIME_CONTRIBUTOR'),
      z.literal('MANNEQUIN'),
      z.literal('MEMBER'),
      z.literal('NONE'),
      z.literal('OWNER'),
    ]),
    labels: z.array(z.object({
      color: z.string(),
      default: z.boolean(),
      description: z.string().nullable(),
      id: z.number(),
      name: z.string(),
      node_id: z.string(),
      url: z.string(),
    })),
    locked: z.boolean(),
    node_id: z.string(),
    user: z.object({
      login: z.string(),
    }).nullable(),
  }),
});

/**
 * Lib - Schema - Sponsorships As Maintainer.
 *
 * Validates the sponsorship connection returned by the GitHub
 * GraphQL API when fetching the maintainer's active sponsors.
 *
 * @since 1.0.1
 */
export const sponsorshipsAsMaintainer = z.object({
  nodes: z.array(z.object({
    sponsorEntity: z.object({
      login: z.string(),
    }).nullable(),
    tier: z.object({
      monthlyPriceInCents: z.number(),
    }).nullable(),
  })),
  pageInfo: z.object({
    endCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
  }),
  totalCount: z.number(),
});
