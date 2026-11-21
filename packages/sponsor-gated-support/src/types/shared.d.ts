/**
 * Shared - Author Role.
 *
 * @since 2.0.13
 */
export type Shared_AuthorRole = 'collaborator' | 'contributor' | 'member' | 'other' | 'owner';

/**
 * Shared - Github Adapter.
 *
 * @since 2.0.13
 */
export type Shared_GithubAdapter_AddIssueComment = (issueId: string, body: string) => Promise<void>;

export type Shared_GithubAdapter_CloseIssue = (issueId: string) => Promise<void>;

export type Shared_GithubAdapter_DeleteIssueComment = (commentId: string) => Promise<void>;

export type Shared_GithubAdapter_GetContext = () => Shared_WorkflowContext;

export type Shared_GithubAdapter_GetSponsors = () => Promise<Shared_Sponsor[]>;

export type Shared_GithubAdapter_LockIssue = (issueId: string) => Promise<void>;

export type Shared_GithubAdapter_ParseIssueCommentEvent = (payload: unknown) => Shared_ParsedIssueCommentEvent;

export type Shared_GithubAdapter_ParseIssuesEvent = (payload: unknown) => Shared_ParsedIssuesEvent;

export type Shared_GithubAdapter = {
  addIssueComment: Shared_GithubAdapter_AddIssueComment;
  closeIssue: Shared_GithubAdapter_CloseIssue;
  deleteIssueComment: Shared_GithubAdapter_DeleteIssueComment;
  getContext: Shared_GithubAdapter_GetContext;
  getSponsors: Shared_GithubAdapter_GetSponsors;
  lockIssue: Shared_GithubAdapter_LockIssue;
  parseIssueCommentEvent: Shared_GithubAdapter_ParseIssueCommentEvent;
  parseIssuesEvent: Shared_GithubAdapter_ParseIssuesEvent;
};

/**
 * Shared - Issue Comment Event.
 *
 * @since 2.0.13
 */
export type Shared_IssueCommentEvent_Action = string;

export type Shared_IssueCommentEvent_Comment_AuthorLogin = string | null;

export type Shared_IssueCommentEvent_Comment_AuthorRole = Shared_AuthorRole;

export type Shared_IssueCommentEvent_Comment_Id = string;

export type Shared_IssueCommentEvent_Comment = {
  authorLogin: Shared_IssueCommentEvent_Comment_AuthorLogin;
  authorRole: Shared_IssueCommentEvent_Comment_AuthorRole;
  id: Shared_IssueCommentEvent_Comment_Id;
};

export type Shared_IssueCommentEvent_Issue_AuthorLogin = string | null;

export type Shared_IssueCommentEvent_Issue_LabelNames = string[];

export type Shared_IssueCommentEvent_Issue = {
  authorLogin: Shared_IssueCommentEvent_Issue_AuthorLogin;
  labelNames: Shared_IssueCommentEvent_Issue_LabelNames;
};

export type Shared_IssueCommentEvent = {
  action: Shared_IssueCommentEvent_Action;
  comment: Shared_IssueCommentEvent_Comment;
  issue: Shared_IssueCommentEvent_Issue;
};

/**
 * Shared - Issues Event.
 *
 * @since 2.0.13
 */
export type Shared_IssuesEvent_Action = string;

export type Shared_IssuesEvent_Issue_AuthorLogin = string | null;

export type Shared_IssuesEvent_Issue_AuthorRole = Shared_AuthorRole;

export type Shared_IssuesEvent_Issue_Id = string;

export type Shared_IssuesEvent_Issue_LabelNames = string[];

export type Shared_IssuesEvent_Issue_Locked = boolean;

export type Shared_IssuesEvent_Issue = {
  authorLogin: Shared_IssuesEvent_Issue_AuthorLogin;
  authorRole: Shared_IssuesEvent_Issue_AuthorRole;
  id: Shared_IssuesEvent_Issue_Id;
  labelNames: Shared_IssuesEvent_Issue_LabelNames;
  locked: Shared_IssuesEvent_Issue_Locked;
};

export type Shared_IssuesEvent = {
  action: Shared_IssuesEvent_Action;
  issue: Shared_IssuesEvent_Issue;
};

/**
 * Shared - Parsed Issue Comment Event.
 *
 * @since 2.0.13
 */
export type Shared_ParsedIssueCommentEvent_Empty_Status = 'empty';

export type Shared_ParsedIssueCommentEvent_Empty = {
  status: Shared_ParsedIssueCommentEvent_Empty_Status;
};

export type Shared_ParsedIssueCommentEvent_Invalid_Status = 'invalid';

export type Shared_ParsedIssueCommentEvent_Invalid = {
  status: Shared_ParsedIssueCommentEvent_Invalid_Status;
};

export type Shared_ParsedIssueCommentEvent_Valid_Status = 'valid';

export type Shared_ParsedIssueCommentEvent_Valid_Event = Shared_IssueCommentEvent;

export type Shared_ParsedIssueCommentEvent_Valid = {
  status: Shared_ParsedIssueCommentEvent_Valid_Status;
  event: Shared_ParsedIssueCommentEvent_Valid_Event;
};

export type Shared_ParsedIssueCommentEvent = Shared_ParsedIssueCommentEvent_Empty | Shared_ParsedIssueCommentEvent_Invalid | Shared_ParsedIssueCommentEvent_Valid;

/**
 * Shared - Parsed Issues Event.
 *
 * @since 2.0.13
 */
export type Shared_ParsedIssuesEvent_Empty_Status = 'empty';

export type Shared_ParsedIssuesEvent_Empty = {
  status: Shared_ParsedIssuesEvent_Empty_Status;
};

export type Shared_ParsedIssuesEvent_Invalid_Status = 'invalid';

export type Shared_ParsedIssuesEvent_Invalid = {
  status: Shared_ParsedIssuesEvent_Invalid_Status;
};

export type Shared_ParsedIssuesEvent_Valid_Status = 'valid';

export type Shared_ParsedIssuesEvent_Valid_Event = Shared_IssuesEvent;

export type Shared_ParsedIssuesEvent_Valid = {
  status: Shared_ParsedIssuesEvent_Valid_Status;
  event: Shared_ParsedIssuesEvent_Valid_Event;
};

export type Shared_ParsedIssuesEvent = Shared_ParsedIssuesEvent_Empty | Shared_ParsedIssuesEvent_Invalid | Shared_ParsedIssuesEvent_Valid;

/**
 * Shared - Sponsor.
 *
 * @since 1.0.1
 */
export type Shared_Sponsor_Type = 'exempt-file' | 'github-api';

export type Shared_Sponsor_Login = string;

export type Shared_Sponsor_Amount = number | null;

export type Shared_Sponsor = {
  type: Shared_Sponsor_Type;
  login: Shared_Sponsor_Login;
  amount: Shared_Sponsor_Amount;
};

/**
 * Shared - Workflow Context.
 *
 * @since 2.0.13
 */
export type Shared_WorkflowContext_EventName = string;

export type Shared_WorkflowContext_Payload = object;

export type Shared_WorkflowContext = {
  eventName: Shared_WorkflowContext_EventName;
  payload: Shared_WorkflowContext_Payload;
};
