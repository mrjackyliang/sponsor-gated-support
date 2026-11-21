import type { Context } from '@actions/github/lib/context';
import type { z } from 'zod';

import type {
  configuration,
  issueCommentPayload,
  issuesPayload,
  sponsorshipsAsMaintainer,
} from '../../lib/schema.js';
import type {
  Shared_AuthorRole,
  Shared_ParsedIssueCommentEvent,
  Shared_ParsedIssuesEvent,
  Shared_Sponsor,
} from '../shared.d.ts';

/**
 * Lib - GitHub.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_Config = z.infer<typeof configuration>;

/**
 * Lib - GitHub -Add Issue Comment.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_AddIssueComment_IssueId = string;

export type Lib_Github_Runner_AddIssueComment_Body = string;

export type Lib_Github_Runner_AddIssueComment_Returns = Promise<void>;

/**
 * Lib - GitHub -Close Issue.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_CloseIssue_IssueId = string;

export type Lib_Github_Runner_CloseIssue_Returns = Promise<void>;

/**
 * Lib - GitHub -Constructor.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_Constructor_Config = z.infer<typeof configuration>;

/**
 * Lib - GitHub -Delete Issue Comment.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_DeleteIssueComment_CommentId = string;

export type Lib_Github_Runner_DeleteIssueComment_Returns = Promise<void>;

/**
 * Lib - GitHub -Fetch Sponsors.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_FetchSponsors_Cursor = string | null;

export type Lib_Github_Runner_FetchSponsors_Results = Shared_Sponsor[];

export type Lib_Github_Runner_FetchSponsors_Returns = Promise<Shared_Sponsor[]>;

export type Lib_Github_Runner_FetchSponsors_OctokitResponseRoot = 'organization' | 'viewer';

export type Lib_Github_Runner_FetchSponsors_OctokitResponse = unknown;

export type Lib_Github_Runner_FetchSponsors_OctokitResponsePath = [Lib_Github_Runner_FetchSponsors_OctokitResponseRoot, 'sponsorshipsAsMaintainer'];

export type Lib_Github_Runner_FetchSponsors_Sponsorships = unknown;

export type Lib_Github_Runner_FetchSponsors_ParsedSponsorships = ReturnType<typeof sponsorshipsAsMaintainer.safeParse>;

export type Lib_Github_Runner_FetchSponsors_Data = z.infer<typeof sponsorshipsAsMaintainer>;

export type Lib_Github_Runner_FetchSponsors_NewResults = Shared_Sponsor[];

/**
 * Lib - GitHub -Get Context.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_GetContext_Returns = Context;

/**
 * Lib - GitHub -Get Sponsors.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_GetSponsors_Returns = Promise<Shared_Sponsor[]>;

/**
 * Lib - GitHub -Lock Issue.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_LockIssue_IssueId = string;

export type Lib_Github_Runner_LockIssue_Returns = Promise<void>;

/**
 * Lib - GitHub -Parse Issue Comment Event.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_ParseIssueCommentEvent_Payload = unknown;

export type Lib_Github_Runner_ParseIssueCommentEvent_Returns = Shared_ParsedIssueCommentEvent;

export type Lib_Github_Runner_ParseIssueCommentEvent_ParsedPayload = ReturnType<typeof issueCommentPayload.safeParse>;

export type Lib_Github_Runner_ParseIssueCommentEvent_Data = z.infer<typeof issueCommentPayload>;

/**
 * Lib - GitHub -Parse Issues Event.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_ParseIssuesEvent_Payload = unknown;

export type Lib_Github_Runner_ParseIssuesEvent_Returns = Shared_ParsedIssuesEvent;

export type Lib_Github_Runner_ParseIssuesEvent_ParsedPayload = ReturnType<typeof issuesPayload.safeParse>;

export type Lib_Github_Runner_ParseIssuesEvent_Data = z.infer<typeof issuesPayload>;

/**
 * Lib - GitHub -To Author Role.
 *
 * @since 2.0.13
 */
export type Lib_Github_Runner_ToAuthorRole_AuthorAssociation = z.infer<typeof issuesPayload>['issue']['author_association'];

export type Lib_Github_Runner_ToAuthorRole_Returns = Shared_AuthorRole;
