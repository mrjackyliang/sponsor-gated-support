import type { Lib_Github_Runner_AddIssueComment_Body, Lib_Github_Runner_AddIssueComment_IssueId, Lib_Github_Runner_AddIssueComment_Returns, Lib_Github_Runner_CloseIssue_IssueId, Lib_Github_Runner_CloseIssue_Returns, Lib_Github_Runner_Constructor_Config, Lib_Github_Runner_DeleteIssueComment_CommentId, Lib_Github_Runner_DeleteIssueComment_Returns, Lib_Github_Runner_GetContext_Returns, Lib_Github_Runner_GetSponsors_Returns, Lib_Github_Runner_LockIssue_IssueId, Lib_Github_Runner_LockIssue_Returns, Lib_Github_Runner_ParseIssueCommentEvent_Payload, Lib_Github_Runner_ParseIssueCommentEvent_Returns, Lib_Github_Runner_ParseIssuesEvent_Payload, Lib_Github_Runner_ParseIssuesEvent_Returns } from '../types/lib/github.d.ts';
export declare class Runner {
    #private;
    constructor(config: Lib_Github_Runner_Constructor_Config);
    addIssueComment(issueId: Lib_Github_Runner_AddIssueComment_IssueId, body: Lib_Github_Runner_AddIssueComment_Body): Lib_Github_Runner_AddIssueComment_Returns;
    closeIssue(issueId: Lib_Github_Runner_CloseIssue_IssueId): Lib_Github_Runner_CloseIssue_Returns;
    deleteIssueComment(commentId: Lib_Github_Runner_DeleteIssueComment_CommentId): Lib_Github_Runner_DeleteIssueComment_Returns;
    getContext(): Lib_Github_Runner_GetContext_Returns;
    getSponsors(): Lib_Github_Runner_GetSponsors_Returns;
    lockIssue(issueId: Lib_Github_Runner_LockIssue_IssueId): Lib_Github_Runner_LockIssue_Returns;
    parseIssueCommentEvent(payload: Lib_Github_Runner_ParseIssueCommentEvent_Payload): Lib_Github_Runner_ParseIssueCommentEvent_Returns;
    parseIssuesEvent(payload: Lib_Github_Runner_ParseIssuesEvent_Payload): Lib_Github_Runner_ParseIssuesEvent_Returns;
    private fetchSponsors;
    private static toAuthorRole;
}
//# sourceMappingURL=github.d.ts.map