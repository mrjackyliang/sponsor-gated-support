import type { z } from 'zod';

import type {
  configuration,
  issueCommentPayload,
  issuesPayload,
} from '../../lib/schema.js';
import type {
  Shared_Sponsor,
  Shared_Sponsor_Login,
} from '../shared.d.ts';

/**
 * Lib - Action - Issue Comment Action.
 *
 * @since 1.0.1
 */
export type Lib_Action_IssueCommentAction_Payload = object;

export type Lib_Action_IssueCommentAction_Config = z.infer<typeof configuration>;

export type Lib_Action_IssueCommentAction_Returns = Promise<void>;

export type Lib_Action_IssueCommentAction_ParsedPayload = ReturnType<typeof issueCommentPayload.safeParse>;

export type Lib_Action_IssueCommentAction_Data = z.infer<typeof issueCommentPayload>;

export type Lib_Action_IssueCommentAction_IssueLabelNames = string[];

/**
 * Lib - Action - Issues Action.
 *
 * @since 1.0.1
 */
export type Lib_Action_IssuesAction_Payload = object;

export type Lib_Action_IssuesAction_Config = z.infer<typeof configuration>;

export type Lib_Action_IssuesAction_Sponsors = Shared_Sponsor[];

export type Lib_Action_IssuesAction_Returns = Promise<void>;

export type Lib_Action_IssuesAction_ParsedPayload = ReturnType<typeof issuesPayload.safeParse>;

export type Lib_Action_IssuesAction_Data = z.infer<typeof issuesPayload>;

export type Lib_Action_IssuesAction_IssueLabelNames = string[];

export type Lib_Action_IssuesAction_SponsorsLogins = Shared_Sponsor_Login[];

export type Lib_Action_IssuesAction_Login = string;
