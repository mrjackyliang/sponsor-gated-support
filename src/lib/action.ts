import * as core from '@actions/core';
import _ from 'lodash';
import util from 'node:util';

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
    core.setFailed('The payload for "issue_comment" is empty');
    core.setOutput('result', false);

    return;
  }

  const parsedPayload = issueCommentPayload.safeParse(payload);

  // If the "issue_comment" payload is invalid.
  if (!parsedPayload.success) {
    core.setFailed('The payload for "issue_comment" is invalid');
    core.setOutput('result', false);

    return;
  }

  const { data } = parsedPayload;

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    data.action !== 'created'
    && data.action !== 'edited'
  ) {
    core.setFailed(`The "${data.action}" action is not supported`);
    core.setOutput('result', false);

    return;
  }

  console.log('issue_comment', util.inspect(data)); // TODO
  console.log('issue_comment', util.inspect(config)); // TODO
  console.log('issue_comment', util.inspect(sponsors)); // TODO

  core.setOutput('result', true);
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
    core.setFailed('The payload for "issues" is empty');
    core.setOutput('result', false);

    return;
  }

  const parsedPayload = issuesPayload.safeParse(payload);

  // If the "issues" payload is invalid.
  if (!parsedPayload.success) {
    core.setFailed('The payload for "issues" is invalid');
    core.setOutput('result', false);

    return;
  }

  const { data } = parsedPayload;

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    data.action !== 'opened'
    && data.action !== 'closed'
  ) {
    core.setFailed(`The "${data.action}" action is not supported`);
    core.setOutput('result', false);

    return;
  }

  // Skip if the issue does not have supported labels.
  if (
    config.issueLabels.length !== 0
    // TODO
  ) {
    core.setOutput('result', true);

    return;
  }

  // If issue is opened.
  if (data.action === 'opened') {
    // Check if the user exists for the issue.
    if (data.issue.user === null) {
      core.setFailed('The issue was opened, however the user information does not exist');
      core.setOutput('result', false);

      return;
    }

    const { login } = data.issue.user;

    if (sponsors.map((sponsor) => sponsor.login).includes(login)) {
      // TODO
    }
  }

  // If issue is closed.
  if (data.action === 'closed') {
    // Check for correct configuration (so runner resources aren't wasted).
    if (!config.issueLockOnClose) {
      core.setFailed('The issue was closed, however the "ISSUE_LOCK_ON_CLOSE" is set to "false"');
      core.setOutput('result', false);

      return;
    }

    // TODO lock the issue
  }

  console.log('issues', util.inspect(data)); // TODO

  core.setOutput('result', true);
}
