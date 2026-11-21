import type { z } from 'zod';

import type { configuration } from '../../lib/schema.js';
import type {
  Shared_GithubAdapter,
  Shared_IssueCommentEvent,
  Shared_IssuesEvent,
  Shared_ParsedIssueCommentEvent,
  Shared_ParsedIssuesEvent,
  Shared_Sponsor,
  Shared_Sponsor_Login,
} from '../shared.d.ts';

/**
 * Lib - Action - Issue Comment Action.
 *
 * @since 1.0.1
 */
export type Lib_Action_IssueCommentAction_ParsedEvent = Shared_ParsedIssueCommentEvent;

export type Lib_Action_IssueCommentAction_Config = z.infer<typeof configuration>;

export type Lib_Action_IssueCommentAction_Github = Shared_GithubAdapter;

export type Lib_Action_IssueCommentAction_Returns = Promise<void>;

export type Lib_Action_IssueCommentAction_Event = Shared_IssueCommentEvent;

/**
 * Lib - Action - Issues Action.
 *
 * @since 1.0.1
 */
export type Lib_Action_IssuesAction_ParsedEvent = Shared_ParsedIssuesEvent;

export type Lib_Action_IssuesAction_Config = z.infer<typeof configuration>;

export type Lib_Action_IssuesAction_Sponsors = Shared_Sponsor[];

export type Lib_Action_IssuesAction_Github = Shared_GithubAdapter;

export type Lib_Action_IssuesAction_Returns = Promise<void>;

export type Lib_Action_IssuesAction_Event = Shared_IssuesEvent;

export type Lib_Action_IssuesAction_SponsorsLogins = Shared_Sponsor_Login[];

export type Lib_Action_IssuesAction_Login = string;
