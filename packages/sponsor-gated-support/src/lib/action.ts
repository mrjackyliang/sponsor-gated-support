import * as core from '@actions/core';
import _ from 'lodash';

import { issueCommentPayload, issuesPayload } from './schema.js';
import {
  addIssueComment,
  closeIssue,
  deleteIssueComment,
  lockIssue,
} from './utility.js';

import type {
  Lib_Action_IssueCommentAction_Config,
  Lib_Action_IssueCommentAction_Data,
  Lib_Action_IssueCommentAction_IssueLabelNames,
  Lib_Action_IssueCommentAction_ParsedPayload,
  Lib_Action_IssueCommentAction_Payload,
  Lib_Action_IssueCommentAction_Returns,
  Lib_Action_IssuesAction_Config,
  Lib_Action_IssuesAction_Data,
  Lib_Action_IssuesAction_IssueLabelNames,
  Lib_Action_IssuesAction_Login,
  Lib_Action_IssuesAction_ParsedPayload,
  Lib_Action_IssuesAction_Payload,
  Lib_Action_IssuesAction_Returns,
  Lib_Action_IssuesAction_Sponsors,
  Lib_Action_IssuesAction_SponsorsLogins,
} from '../types/lib/action.d.ts';

/**
 * Lib - Action - Issue Comment Action.
 *
 * Deletes comments left on gated issues by users who are not the
 * issue creator or a recognized member, owner, or contributor.
 *
 * @param {Lib_Action_IssueCommentAction_Payload} payload - Payload.
 * @param {Lib_Action_IssueCommentAction_Config}  config  - Config.
 *
 * @returns {Lib_Action_IssueCommentAction_Returns}
 *
 * @since 1.0.1
 */
export async function issueCommentAction(payload: Lib_Action_IssueCommentAction_Payload, config: Lib_Action_IssueCommentAction_Config): Lib_Action_IssueCommentAction_Returns {
  if (_.isEmpty(payload) === true) {
    core.setFailed('The payload for "issue_comment" is empty');

    core.setOutput('result', false);

    return;
  }

  const parsedPayload: Lib_Action_IssueCommentAction_ParsedPayload = issueCommentPayload.safeParse(payload);

  // If the "issue_comment" payload is invalid.
  if (parsedPayload.success === false) {
    core.setFailed('The payload for "issue_comment" is invalid');

    core.setOutput('result', false);

    return;
  }

  const data: Lib_Action_IssueCommentAction_Data = parsedPayload.data;
  const issueLabelNames: Lib_Action_IssueCommentAction_IssueLabelNames = data['issue']['labels'].map((label) => label['name']);

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    data['action'] !== 'created'
    && data['action'] !== 'edited'
  ) {
    core.setFailed(`The "${data['action']}" action is not supported`);

    core.setOutput('result', false);

    return;
  }

  // Check for the correct configuration (so runner resources aren't wasted).
  if (config['issueLimitCommenter'] === false) {
    core.setFailed('An issue comment was created or edited, however the "ISSUE_LIMIT_COMMENTER" setting is set to "false"');

    core.setOutput('result', false);

    return;
  }

  // Skip if the issue does not have wanted labels.
  if (
    config['issueLabels'].length !== 0
    && issueLabelNames.some((issueLabelName) => config['issueLabels'].includes(issueLabelName)) === false
  ) {
    core.info('Skipping "issue_comment" action, issue does not have wanted labels');

    core.setOutput('result', true);

    return;
  }

  core.info(`Running tasks for when an issue comment is ${data['action']}`);

  // Check if the user exists for the issue.
  if (
    data['comment']['user'] === null
    || data['issue']['user'] === null
  ) {
    core.setFailed('An issue comment was created or edited, however the comment and/or issue user information does not exist');

    core.setOutput('result', false);

    return;
  }

  // Skip if comment ownership is the issue creator, member, owner, contributor, or collaborator.
  if (
    data['comment']['user']['login'] === data['issue']['user']['login']
    || data['comment']['author_association'] === 'MEMBER'
    || data['comment']['author_association'] === 'OWNER'
    || data['comment']['author_association'] === 'CONTRIBUTOR'
    || data['comment']['author_association'] === 'COLLABORATOR'
  ) {
    core.info('Skipping "issue_comment" action, issue comment is made by either issue creator, member, owner, contributor, or collaborator');

    core.setOutput('result', true);

    return;
  }

  // Delete the comment.
  core.info('Deleting issue comment');

  await deleteIssueComment(data['comment']['node_id'], config);

  core.setOutput('result', true);

  return;
}

/**
 * Lib - Action - Issues Action.
 *
 * Welcomes sponsors who open gated issues, and closes and locks
 * issues opened by users who are not sponsoring or recognized.
 *
 * @param {Lib_Action_IssuesAction_Payload}  payload  - Payload.
 * @param {Lib_Action_IssuesAction_Config}   config   - Config.
 * @param {Lib_Action_IssuesAction_Sponsors} sponsors - Sponsors.
 *
 * @returns {Lib_Action_IssuesAction_Returns}
 *
 * @since 1.0.1
 */
export async function issuesAction(payload: Lib_Action_IssuesAction_Payload, config: Lib_Action_IssuesAction_Config, sponsors: Lib_Action_IssuesAction_Sponsors): Lib_Action_IssuesAction_Returns {
  if (_.isEmpty(payload) === true) {
    core.setFailed('The payload for "issues" is empty');

    core.setOutput('result', false);

    return;
  }

  const parsedPayload: Lib_Action_IssuesAction_ParsedPayload = issuesPayload.safeParse(payload);

  // If the "issues" payload is invalid.
  if (parsedPayload.success === false) {
    core.setFailed('The payload for "issues" is invalid');

    core.setOutput('result', false);

    return;
  }

  const data: Lib_Action_IssuesAction_Data = parsedPayload.data;
  const issueLabelNames: Lib_Action_IssuesAction_IssueLabelNames = data['issue']['labels'].map((label) => label['name']);
  const sponsorsLogins: Lib_Action_IssuesAction_SponsorsLogins = sponsors.map((sponsor) => sponsor['login']);

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    data['action'] !== 'opened'
    && data['action'] !== 'closed'
  ) {
    core.setFailed(`The "${data['action']}" action is not supported`);

    core.setOutput('result', false);

    return;
  }

  // Skip if the issue does not have wanted labels.
  if (
    config['issueLabels'].length !== 0
    && issueLabelNames.some((issueLabelName) => config['issueLabels'].includes(issueLabelName)) === false
  ) {
    core.info('Skipping "issues" action, issue does not have wanted labels');

    core.setOutput('result', true);

    return;
  }

  // If issue is opened.
  if (data['action'] === 'opened') {
    core.info('Running tasks for when an issue is open');

    // Check if the user exists for the issue.
    if (data['issue']['user'] === null) {
      core.setFailed('The issue was opened, however the user information does not exist');

      core.setOutput('result', false);

      return;
    }

    const login: Lib_Action_IssuesAction_Login = data['issue']['user']['login'];

    // Check if the user is either sponsoring (including exempt list), a member, an owner, a contributor, or a collaborator.
    if (
      sponsorsLogins.includes(login) === true
      || data['issue']['author_association'] === 'MEMBER'
      || data['issue']['author_association'] === 'OWNER'
      || data['issue']['author_association'] === 'CONTRIBUTOR'
      || data['issue']['author_association'] === 'COLLABORATOR'
    ) {
      core.info('Adding issue comment based on "ISSUE_MESSAGE_WELCOME"');

      await addIssueComment(data['issue']['node_id'], config['issueMessageWelcome'], config);
    } else {
      core.info('Adding issue comment based on "ISSUE_MESSAGE_NOT_SPONSOR"');

      try {
        await addIssueComment(data['issue']['node_id'], config['issueMessageNotSponsor'], config);
      } catch {
        core.warning('Failed to add issue comment, continuing to close and lock');
      }

      core.info('Closing issue');

      try {
        await closeIssue(data['issue']['node_id'], config);
      } catch {
        core.warning('Failed to close issue, continuing to lock');
      }

      core.info('Locking issue');

      await lockIssue(data['issue']['node_id'], config);
    }
  }

  // If issue is closed.
  if (data['action'] === 'closed') {
    core.info('Running tasks for when an issue is closed');

    // Check for the correct configuration (so runner resources aren't wasted).
    if (config['issueLockOnClose'] === false) {
      core.setFailed('The issue was closed, however the "ISSUE_LOCK_ON_CLOSE" setting is set to "false"');

      core.setOutput('result', false);

      return;
    }

    // Skip if the issue is already locked.
    if (data['issue']['locked'] === true) {
      core.info('Skipping "issues" action, issue is already locked');

      core.setOutput('result', true);

      return;
    }

    // Lock the issue.
    core.info('Locking issue');

    await lockIssue(data['issue']['node_id'], config);
  }

  core.setOutput('result', true);

  return;
}
