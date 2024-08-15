import * as core from '@actions/core';
import _ from 'lodash';
import util from 'node:util';

import { issueCommentPayload, issuesPayload } from '@/lib/schema.js';
import { addIssueComment, closeIssue, lockIssue } from '@/lib/utility.js';
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
export async function issueCommentAction(payload: IssueCommentActionPayload, config: IssueCommentActionConfig, sponsors: IssueCommentActionSponsors): IssueCommentActionReturns {
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
export async function issuesAction(payload: IssuesActionPayload, config: IssuesActionConfig, sponsors: IssuesActionSponsors): IssuesActionReturns {
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
  const issueLabelNames = data.issue.labels.map((label) => label.name);
  const sponsorsLogins = sponsors.map((sponsor) => sponsor.login);

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    data.action !== 'opened'
    && data.action !== 'closed'
  ) {
    core.setFailed(`The "${data.action}" action is not supported`);
    core.setOutput('result', false);

    return;
  }

  // Skip if the issue does not have wanted labels.
  if (
    config.issueLabels.length !== 0
    && !issueLabelNames.some((issueLabelName) => config.issueLabels.includes(issueLabelName))
  ) {
    core.info('Skipping action, issue does not have wanted labels');
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

    // If user creating the issue is not in the sponsor list.
    if (sponsorsLogins.includes(login)) {
      await addIssueComment(data.issue.node_id, config.issueMessageWelcome, config);
    } else {
      await addIssueComment(data.issue.node_id, config.issueMessageNotSponsor, config);
      await closeIssue(data.issue.node_id, config);
      await lockIssue(data.issue.node_id, config);
    }
  }

  // If issue is closed.
  if (data.action === 'closed') {
    // Check for the correct configuration (so runner resources aren't wasted).
    if (!config.issueLockOnClose) {
      core.setFailed('The issue was closed, however the "ISSUE_LOCK_ON_CLOSE" is set to "false"');
      core.setOutput('result', false);

      return;
    }

    // Skip if the issue is already locked.
    if (data.issue.locked) {
      core.info('Skipping action, issue is already locked');
      core.setOutput('result', true);

      return;
    }

    // Lock the issue.
    await lockIssue(data.issue.node_id, config);
  }

  core.setOutput('result', true);
}
