import type { Context } from '@actions/github/lib/context';
import type { z } from 'zod';

import type {
  configuration,
  sponsorshipsAsMaintainer,
} from '../../lib/schema.js';
import type { Shared_Sponsor } from '../shared.d.ts';

/**
 * Lib - Utility - Add Issue Comment.
 *
 * @since 1.0.1
 */
export type Lib_Utility_AddIssueComment_NodeId = string;

export type Lib_Utility_AddIssueComment_Body = string;

export type Lib_Utility_AddIssueComment_Config = z.infer<typeof configuration>;

export type Lib_Utility_AddIssueComment_Returns = Promise<void>;

/**
 * Lib - Utility - Close Issue.
 *
 * @since 1.0.1
 */
export type Lib_Utility_CloseIssue_NodeId = string;

export type Lib_Utility_CloseIssue_Config = z.infer<typeof configuration>;

export type Lib_Utility_CloseIssue_Returns = Promise<void>;

/**
 * Lib - Utility - Delete Issue Comment.
 *
 * @since 1.0.1
 */
export type Lib_Utility_DeleteIssueComment_NodeId = string;

export type Lib_Utility_DeleteIssueComment_Config = z.infer<typeof configuration>;

export type Lib_Utility_DeleteIssueComment_Returns = Promise<void>;

/**
 * Lib - Utility - Get Config.
 *
 * @since 1.0.1
 */
export type Lib_Utility_GetConfig_Returns = z.infer<typeof configuration>;

/**
 * Lib - Utility - Get Context.
 *
 * @since 1.0.1
 */
export type Lib_Utility_GetContext_Returns = Context;

/**
 * Lib - Utility - Get Sponsors.
 *
 * @since 1.0.1
 */
export type Lib_Utility_GetSponsors_Config = z.infer<typeof configuration>;

export type Lib_Utility_GetSponsors_Cursor = string | null;

export type Lib_Utility_GetSponsors_Results = Shared_Sponsor[];

export type Lib_Utility_GetSponsors_Returns = Promise<Shared_Sponsor[]>;

export type Lib_Utility_GetSponsors_OctokitResponseRoot = 'organization' | 'viewer';

export type Lib_Utility_GetSponsors_OctokitResponse = unknown;

export type Lib_Utility_GetSponsors_OctokitResponsePath = [Lib_Utility_GetSponsors_OctokitResponseRoot, 'sponsorshipsAsMaintainer'];

export type Lib_Utility_GetSponsors_Sponsorships = unknown;

export type Lib_Utility_GetSponsors_ParsedSponsorships = ReturnType<typeof sponsorshipsAsMaintainer.safeParse>;

export type Lib_Utility_GetSponsors_Data = z.infer<typeof sponsorshipsAsMaintainer>;

export type Lib_Utility_GetSponsors_NewResults = Shared_Sponsor[];

/**
 * Lib - Utility - Get Sponsors Exempt.
 *
 * @since 1.0.1
 */
export type Lib_Utility_GetSponsorsExempt_Config = z.infer<typeof configuration>;

export type Lib_Utility_GetSponsorsExempt_Returns = Shared_Sponsor[];

export type Lib_Utility_GetSponsorsExempt_SponsorExemptFileLocation = string;

export type Lib_Utility_GetSponsorsExempt_File = string;

export type Lib_Utility_GetSponsorsExempt_Exempts = string[];

/**
 * Lib - Utility - Lock Issue.
 *
 * @since 1.0.1
 */
export type Lib_Utility_LockIssue_NodeId = string;

export type Lib_Utility_LockIssue_Config = z.infer<typeof configuration>;

export type Lib_Utility_LockIssue_Returns = Promise<void>;
