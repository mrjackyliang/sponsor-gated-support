import type { Context } from '@actions/github/lib/context';
import type { z } from 'zod';

import type { configuration } from '@/lib/schema.js';
import type { Sponsor } from '@/types/shared.js';

/**
 * Add issue comment.
 *
 * @since 1.0.0
 */
export type AddIssueCommentNodeId = string;

export type AddIssueCommentBody = string;

export type AddIssueCommentConfig = z.infer<typeof configuration>;

export type AddIssueCommentReturns = Promise<void>;

/**
 * Close issue.
 *
 * @since 1.0.0
 */
export type CloseIssueNodeId = string;

export type CloseIssueConfig = z.infer<typeof configuration>;

export type CloseIssueReturns = Promise<void>;

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

export type IssueCommentActionReturns = Promise<void>;

/**
 * Issues action.
 *
 * @since 1.0.0
 */
export type IssuesActionPayload = object;

export type IssuesActionConfig = z.infer<typeof configuration>;

export type IssuesActionSponsors = Sponsor[];

export type IssuesActionReturns = Promise<void>;

/**
 * Lock issue.
 *
 * @since 1.0.0
 */
export type LockIssueNodeId = string;

export type LockIssueConfig = z.infer<typeof configuration>;

export type LockIssueReturns = Promise<void>;

/**
 * Run action.
 *
 * @since 1.0.0
 */
export type RunActionReturns = Promise<void>;
