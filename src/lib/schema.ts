import { z } from 'zod';

/**
 * Configuration.
 *
 * @since 1.0.0
 */
export const configuration = z.object({
  githubToken: z.string()
    .startsWith('ghp_'),
  issueLabels: z.string(),
  issueLimitCommenter: z.enum(['true', 'false'])
    .transform((value) => value === 'true'),
  issueLockOnClose: z.enum(['true', 'false'])
    .transform((value) => value === 'true'),
  isOrganization: z.enum(['true', 'false'])
    .transform((value) => value === 'true'),
  sponsorActiveOnly: z.enum(['true', 'false'])
    .transform((value) => value === 'true'),
  sponsorExemptFileLocation: z.string().default('./SPONSOR_EXEMPT'),
  sponsorMinimum: z.number({
    coerce: true,
  }).default(0),
});

/**
 * Issue comment payload.
 *
 * @since 1.0.0
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
    user: z.object({
      login: z.string(),
    }).nullable(),
  }),
});

/**
 * Issues payload.
 *
 * @since 1.0.0
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
    user: z.object({
      login: z.string(),
    }).nullable(),
  }),
});

/**
 * Sponsorships as maintainer.
 *
 * @since 1.0.0
 */
export const sponsorshipsAsMaintainer = z.object({
  nodes: z.array(z.object({
    sponsorEntity: z.object({
      login: z.string(),
    }).nullable(),
    createdAt: z.string(),
    privacyLevel: z.union([
      z.literal('PUBLIC'),
      z.literal('PRIVATE'),
    ]),
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
