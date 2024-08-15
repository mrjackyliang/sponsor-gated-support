import * as core from '@actions/core';
import _ from 'lodash';

import { issueCommentPayload, issuesPayload } from '@/lib/schema.js';
import {
  addIssueComment,
  closeIssue,
  deleteIssueComment,
  lockIssue,
} from '@/lib/utility.js';
import type {
  IssueCommentActionConfig,
  IssueCommentActionPayload,
  IssueCommentActionReturns,
  IssuesActionConfig,
  IssuesActionPayload,
  IssuesActionReturns,
  IssuesActionSponsors,
} from '@/types/index.d.ts';

/**
 * Issue comment action.
 *
 * @param {IssueCommentActionPayload}  payload - Payload.
 * @param {IssueCommentActionConfig}   config  - Config.
 *
 * @returns {IssueCommentActionReturns}
 *
 * @since 1.0.0
 */
export async function issueCommentAction(payload: IssueCommentActionPayload, config: IssueCommentActionConfig): IssueCommentActionReturns {
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
  const issueLabelNames = data.issue.labels.map((label) => label.name);

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    data.action !== 'created'
    && data.action !== 'edited'
  ) {
    core.setFailed(`The "${data.action}" action is not supported`);
    core.setOutput('result', false);

    return;
  }

  core.info(`Running tasks for when an issue comment is ${data.action}`);

  // Check for the correct configuration (so runner resources aren't wasted).
  if (!config.issueLimitCommenter) {
    core.setFailed('An issue comment was created or edited, however the "ISSUE_LIMIT_COMMENTER" setting is set to "false"');
    core.setOutput('result', false);

    return;
  }

  // Skip if the issue does not have wanted labels.
  if (
    config.issueLabels.length !== 0
    && !issueLabelNames.some((issueLabelName) => config.issueLabels.includes(issueLabelName))
  ) {
    core.info('Skipping "issue_comment" action, issue does not have wanted labels');
    core.setOutput('result', true);

    return;
  }

  // Check if the user exists for the issue.
  if (
    data.comment.user === null
    || data.issue.user === null
  ) {
    core.setFailed('An issue comment was created or edited, however the comment and/or issue user information does not exist');
    core.setOutput('result', false);

    return;
  }

  // Skip if comment ownership is the issue creator or owner.
  if (
    data.comment.user.login === data.issue.user.login
    || data.comment.author_association === 'OWNER'
  ) {
    core.info('Skipping "issue_comment" action, issue comment is made by either issue creator or owner');
    core.setOutput('result', true);

    return;
  }

  // Delete the comment.
  core.info('Deleting issue comment');
  await deleteIssueComment(data.comment.node_id, config);

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
    core.info('Skipping "issues" action, issue does not have wanted labels');
    core.setOutput('result', true);

    return;
  }

  // If issue is opened.
  if (data.action === 'opened') {
    core.info('Running tasks for when an issue is open');

    // Check if the user exists for the issue.
    if (data.issue.user === null) {
      core.setFailed('The issue was opened, however the user information does not exist');
      core.setOutput('result', false);

      return;
    }

    const { login } = data.issue.user;

    // Check if the user is either sponsoring, in the exempt list, or is an owner.
    if (
      sponsorsLogins.includes(login)
      || data.issue.author_association === 'OWNER'
    ) {
      core.info('Adding issue comment based on "ISSUE_MESSAGE_WELCOME"');
      await addIssueComment(data.issue.node_id, config.issueMessageWelcome, config);
    } else {
      core.info('Adding issue comment based on "ISSUE_MESSAGE_NOT_SPONSOR"');
      await addIssueComment(data.issue.node_id, config.issueMessageNotSponsor, config);

      core.info('Closing issue');
      await closeIssue(data.issue.node_id, config);

      core.info('Locking issue');
      await lockIssue(data.issue.node_id, config);
    }
  }

  // If issue is closed.
  if (data.action === 'closed') {
    core.info('Running tasks for when an issue is closed');

    // Check for the correct configuration (so runner resources aren't wasted).
    if (!config.issueLockOnClose) {
      core.setFailed('The issue was closed, however the "ISSUE_LOCK_ON_CLOSE" setting is set to "false"');
      core.setOutput('result', false);

      return;
    }

    // Skip if the issue is already locked.
    if (data.issue.locked) {
      core.info('Skipping "issues" action, issue is already locked');
      core.setOutput('result', true);

      return;
    }

    // Lock the issue.
    core.info('Locking issue');
    await lockIssue(data.issue.node_id, config);
  }

  core.setOutput('result', true);
}
