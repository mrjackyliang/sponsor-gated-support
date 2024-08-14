import * as core from '@actions/core';
import _ from 'lodash';

import { issueCommentPayload, issuesPayload } from '@/lib/schema.js';
import type {
  IssueCommentActionConfig,
  IssueCommentActionPayload,
  IssueCommentActionReturns,
  IssueCommentActionSponsors,
  IssuesActionConfig,
  IssuesActionPayload,
  IssuesActionReturns,
  IssuesActionSponsors,
} from '@/types/index.d.ts';

/**
 * Issue comment action.
 *
 * @param {IssueCommentActionPayload}  payload  - Payload.
 * @param {IssueCommentActionConfig}   config   - Config.
 * @param {IssueCommentActionSponsors} sponsors - Sponsors.
 *
 * @returns {IssueCommentActionReturns}
 *
 * @since 1.0.0
 */
export function issueCommentAction(payload: IssueCommentActionPayload, config: IssueCommentActionConfig, sponsors: IssueCommentActionSponsors): IssueCommentActionReturns {
  if (_.isEmpty(payload)) {
    core.setOutput('result', false);
    core.setFailed('The payload for "issue_comment" is empty');

    return;
  }

  const parsedPayload = issueCommentPayload.safeParse(payload);

  // If the "issue_comment" payload is invalid.
  if (!parsedPayload.success) {
    core.setOutput('result', false);
    core.setFailed('The payload for "issue_comment" is invalid');

    return;
  }

  const { data } = parsedPayload;

  console.log(payload); // TODO
}

/**
 * Issues action.
 *
 * @param {IssuesActionPayload}  payload  - Payload.
 * @param {IssuesActionConfig}   config   - Config.
 * @param {IssuesActionSponsors} sponsors - Sponsors.
 *
 * @returns {IssuesActionReturns}
 *
 * @since 1.0.0
 */
export function issuesAction(payload: IssuesActionPayload, config: IssuesActionConfig, sponsors: IssuesActionSponsors): IssuesActionReturns {
  if (_.isEmpty(payload)) {
    core.setOutput('result', false);
    core.setFailed('The payload for "issues" is empty');

    return;
  }

  const parsedPayload = issuesPayload.safeParse(payload);

  // If the "issues" payload is invalid.
  if (!parsedPayload.success) {
    core.setOutput('result', false);
    core.setFailed('The payload for "issues" is invalid');

    return;
  }

  const { data } = parsedPayload;

  console.log(payload); // TODO
}
