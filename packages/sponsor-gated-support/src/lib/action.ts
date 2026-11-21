import * as core from '@actions/core';

import type {
  Lib_Action_IssueCommentAction_Config,
  Lib_Action_IssueCommentAction_Event,
  Lib_Action_IssueCommentAction_Github,
  Lib_Action_IssueCommentAction_ParsedEvent,
  Lib_Action_IssueCommentAction_Returns,
  Lib_Action_IssuesAction_Config,
  Lib_Action_IssuesAction_Event,
  Lib_Action_IssuesAction_Github,
  Lib_Action_IssuesAction_Login,
  Lib_Action_IssuesAction_ParsedEvent,
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
 * @param {Lib_Action_IssueCommentAction_ParsedEvent} parsedEvent - Parsed event.
 * @param {Lib_Action_IssueCommentAction_Config}      config      - Config.
 * @param {Lib_Action_IssueCommentAction_Github}      github      - Github.
 *
 * @returns {Lib_Action_IssueCommentAction_Returns}
 *
 * @since 1.0.1
 */
export async function issueCommentAction(parsedEvent: Lib_Action_IssueCommentAction_ParsedEvent, config: Lib_Action_IssueCommentAction_Config, github: Lib_Action_IssueCommentAction_Github): Lib_Action_IssueCommentAction_Returns {
  if (parsedEvent['status'] === 'empty') {
    core.setFailed('The payload for "issue_comment" is empty');

    core.setOutput('result', false);

    return;
  }

  // If the "issue_comment" payload is invalid.
  if (parsedEvent['status'] === 'invalid') {
    core.setFailed('The payload for "issue_comment" is invalid');

    core.setOutput('result', false);

    return;
  }

  const event: Lib_Action_IssueCommentAction_Event = parsedEvent['event'];

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    event['action'] !== 'created'
    && event['action'] !== 'edited'
  ) {
    core.setFailed(`The "${event['action']}" action is not supported`);

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
    && event['issue']['labelNames'].some((issueLabelName) => config['issueLabels'].includes(issueLabelName)) === false
  ) {
    core.info('Skipping "issue_comment" action, issue does not have wanted labels');

    core.setOutput('result', true);

    return;
  }

  core.info(`Running tasks for when an issue comment is ${event['action']}`);

  // Check if the user exists for the issue.
  if (
    event['comment']['authorLogin'] === null
    || event['issue']['authorLogin'] === null
  ) {
    core.setFailed('An issue comment was created or edited, however the comment and/or issue user information does not exist');

    core.setOutput('result', false);

    return;
  }

  // Skip if comment ownership is the issue creator, member, owner, contributor, or collaborator.
  if (
    event['comment']['authorLogin'] === event['issue']['authorLogin']
    || event['comment']['authorRole'] === 'member'
    || event['comment']['authorRole'] === 'owner'
    || event['comment']['authorRole'] === 'contributor'
    || event['comment']['authorRole'] === 'collaborator'
  ) {
    core.info('Skipping "issue_comment" action, issue comment is made by either issue creator, member, owner, contributor, or collaborator');

    core.setOutput('result', true);

    return;
  }

  // Delete the comment.
  core.info('Deleting issue comment');

  await github.deleteIssueComment(event['comment']['id']);

  core.setOutput('result', true);

  return;
}

/**
 * Lib - Action - Issues Action.
 *
 * Welcomes sponsors who open gated issues, and closes and locks
 * issues opened by users who are not sponsoring or recognized.
 *
 * @param {Lib_Action_IssuesAction_ParsedEvent} parsedEvent - Parsed event.
 * @param {Lib_Action_IssuesAction_Config}      config      - Config.
 * @param {Lib_Action_IssuesAction_Sponsors}    sponsors    - Sponsors.
 * @param {Lib_Action_IssuesAction_Github}      github      - Github.
 *
 * @returns {Lib_Action_IssuesAction_Returns}
 *
 * @since 1.0.1
 */
export async function issuesAction(parsedEvent: Lib_Action_IssuesAction_ParsedEvent, config: Lib_Action_IssuesAction_Config, sponsors: Lib_Action_IssuesAction_Sponsors, github: Lib_Action_IssuesAction_Github): Lib_Action_IssuesAction_Returns {
  if (parsedEvent['status'] === 'empty') {
    core.setFailed('The payload for "issues" is empty');

    core.setOutput('result', false);

    return;
  }

  // If the "issues" payload is invalid.
  if (parsedEvent['status'] === 'invalid') {
    core.setFailed('The payload for "issues" is invalid');

    core.setOutput('result', false);

    return;
  }

  const event: Lib_Action_IssuesAction_Event = parsedEvent['event'];
  const sponsorsLogins: Lib_Action_IssuesAction_SponsorsLogins = sponsors.map((sponsor) => sponsor['login']);

  // Check if the action is supported (so runner resources aren't wasted).
  if (
    event['action'] !== 'opened'
    && event['action'] !== 'closed'
  ) {
    core.setFailed(`The "${event['action']}" action is not supported`);

    core.setOutput('result', false);

    return;
  }

  // Skip if the issue does not have wanted labels.
  if (
    config['issueLabels'].length !== 0
    && event['issue']['labelNames'].some((issueLabelName) => config['issueLabels'].includes(issueLabelName)) === false
  ) {
    core.info('Skipping "issues" action, issue does not have wanted labels');

    core.setOutput('result', true);

    return;
  }

  // If issue is opened.
  if (event['action'] === 'opened') {
    core.info('Running tasks for when an issue is open');

    // Check if the user exists for the issue.
    if (event['issue']['authorLogin'] === null) {
      core.setFailed('The issue was opened, however the user information does not exist');

      core.setOutput('result', false);

      return;
    }

    const login: Lib_Action_IssuesAction_Login = event['issue']['authorLogin'];

    // Check if the user is either sponsoring (including exempt list), a member, an owner, a contributor, or a collaborator.
    if (
      sponsorsLogins.includes(login) === true
      || event['issue']['authorRole'] === 'member'
      || event['issue']['authorRole'] === 'owner'
      || event['issue']['authorRole'] === 'contributor'
      || event['issue']['authorRole'] === 'collaborator'
    ) {
      core.info('Adding issue comment based on "ISSUE_MESSAGE_WELCOME"');

      await github.addIssueComment(event['issue']['id'], config['issueMessageWelcome']);
    } else {
      core.info('Adding issue comment based on "ISSUE_MESSAGE_NOT_SPONSOR"');

      try {
        await github.addIssueComment(event['issue']['id'], config['issueMessageNotSponsor']);
      } catch {
        core.warning('Failed to add issue comment, continuing to close and lock');
      }

      core.info('Closing issue');

      try {
        await github.closeIssue(event['issue']['id']);
      } catch {
        core.warning('Failed to close issue, continuing to lock');
      }

      core.info('Locking issue');

      await github.lockIssue(event['issue']['id']);
    }
  }

  // If issue is closed.
  if (event['action'] === 'closed') {
    core.info('Running tasks for when an issue is closed');

    // Check for the correct configuration (so runner resources aren't wasted).
    if (config['issueLockOnClose'] === false) {
      core.setFailed('The issue was closed, however the "ISSUE_LOCK_ON_CLOSE" setting is set to "false"');

      core.setOutput('result', false);

      return;
    }

    // Skip if the issue is already locked.
    if (event['issue']['locked'] === true) {
      core.info('Skipping "issues" action, issue is already locked');

      core.setOutput('result', true);

      return;
    }

    // Lock the issue.
    core.info('Locking issue');

    await github.lockIssue(event['issue']['id']);
  }

  core.setOutput('result', true);

  return;
}
