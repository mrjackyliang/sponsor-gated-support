import type { Context } from '@actions/github/lib/context';
import type { z } from 'zod';

import type { configuration } from '@/lib/schema.js';
import type { Sponsor } from '@/types/shared.js';

/**
 * Get config.
 *
 * @since 1.0.0
 */
export type GetConfigReturns = z.infer<typeof configuration>;

/**
 * Get context.
 *
 * @since 1.0.0
 */
export type GetContextReturns = Context;

/**
 * Get sponsors.
 *
 * @since 1.0.0
 */
export type GetSponsorsConfig = z.infer<typeof configuration>;

export type GetSponsorsCursor = string | null;

export type GetSponsorsResults = Sponsor[];

export type GetSponsorsReturns = Promise<Sponsor[]>;

/**
 * Get sponsors exempt.
 *
 * @since 1.0.0
 */
export type GetSponsorsExemptConfig = z.infer<typeof configuration>;

export type GetSponsorsExemptReturns = Sponsor[];

/**
 * Issue comment action.
 *
 * @since 1.0.0
 */
export type IssueCommentActionPayload = object;

export type IssueCommentActionConfig = z.infer<typeof configuration>;

export type IssueCommentActionSponsors = Sponsor[];

export type IssueCommentActionReturns = void;

/**
 * Issues action.
 *
 * @since 1.0.0
 */
export type IssuesActionPayload = object;

export type IssuesActionConfig = z.infer<typeof configuration>;

export type IssuesActionSponsors = Sponsor[];

export type IssuesActionReturns = void;

/**
 * Run action.
 *
 * @since 1.0.0
 */
export type RunActionReturns = Promise<void>;
