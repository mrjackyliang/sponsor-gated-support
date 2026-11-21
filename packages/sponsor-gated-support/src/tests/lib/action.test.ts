import * as core from '@actions/core';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { issueCommentAction, issuesAction } from '../../lib/action.js';

vi.mock('@actions/core', () => ({
  setFailed: vi.fn(),
  setOutput: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}));

const fakeGithub = {
  addIssueComment: vi.fn(),
  closeIssue: vi.fn(),
  deleteIssueComment: vi.fn(),
  getContext: vi.fn(),
  getSponsors: vi.fn(),
  lockIssue: vi.fn(),
  parseIssueCommentEvent: vi.fn(),
  parseIssuesEvent: vi.fn(),
};

const baseConfig = {
  githubPersonalAccessToken: 'ghp_test123',
  githubWorkflowToken: 'ghs_test456',
  issueLabels: ['support'],
  issueLimitCommenter: true,
  issueLockOnClose: true,
  issueMessageNotSponsor: 'Not a sponsor.',
  issueMessageWelcome: 'Welcome!',
  isOrganization: false,
  sponsorActiveOnly: true,
  sponsorExemptFileLocation: './SPONSOR_EXEMPT',
  sponsorMinimum: 0,
};

const baseCommentEvent = {
  action: 'created',
  comment: {
    authorLogin: 'outsider',
    authorRole: 'other' as const,
    id: 'IC_abc123',
  },
  issue: {
    authorLogin: 'issueOwner',
    labelNames: ['support'],
  },
};

const baseIssueEvent = {
  action: 'opened',
  issue: {
    authorLogin: 'testUser',
    authorRole: 'other' as const,
    id: 'I_abc123',
    labelNames: ['support'],
    locked: false,
  },
};

beforeEach(() => {
  vi.clearAllMocks();

  fakeGithub['addIssueComment'].mockResolvedValue(undefined);

  fakeGithub['closeIssue'].mockResolvedValue(undefined);

  fakeGithub['deleteIssueComment'].mockResolvedValue(undefined);

  fakeGithub['lockIssue'].mockResolvedValue(undefined);

  return;
});

/**
 * Tests - Lib - Action - Issue Comment Action.
 *
 * @since 1.0.1
 */
describe('issueCommentAction', () => {
  it('sets failed on empty payload', async () => {
    await issueCommentAction({ status: 'empty' }, baseConfig, fakeGithub);

    expect(core.setFailed).toHaveBeenCalledWith('The payload for "issue_comment" is empty');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed on invalid payload', async () => {
    await issueCommentAction({ status: 'invalid' }, baseConfig, fakeGithub);

    expect(core.setFailed).toHaveBeenCalledWith('The payload for "issue_comment" is invalid');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('skips when issue lacks wanted labels', async () => {
    await issueCommentAction({
      status: 'valid',
      event: {
        ...baseCommentEvent,
        issue: {
          ...baseCommentEvent['issue'],
          labelNames: ['bug'],
        },
      },
    }, baseConfig, fakeGithub);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    expect(core.setFailed).not.toHaveBeenCalled();

    return;
  });

  it('skips when commenter is the issue creator', async () => {
    await issueCommentAction({
      status: 'valid',
      event: {
        ...baseCommentEvent,
        comment: {
          ...baseCommentEvent['comment'],
          authorLogin: 'issueOwner',
        },
      },
    }, baseConfig, fakeGithub);

    expect(fakeGithub['deleteIssueComment']).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('skips when commenter is an owner', async () => {
    await issueCommentAction({
      status: 'valid',
      event: {
        ...baseCommentEvent,
        comment: {
          ...baseCommentEvent['comment'],
          authorRole: 'owner',
        },
      },
    }, baseConfig, fakeGithub);

    expect(fakeGithub['deleteIssueComment']).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('sets failed when comment author is unknown', async () => {
    await issueCommentAction({
      status: 'valid',
      event: {
        ...baseCommentEvent,
        comment: {
          ...baseCommentEvent['comment'],
          authorLogin: null,
        },
      },
    }, baseConfig, fakeGithub);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed on unsupported action', async () => {
    await issueCommentAction({
      status: 'valid',
      event: {
        ...baseCommentEvent,
        action: 'deleted',
      },
    }, baseConfig, fakeGithub);

    expect(core.setFailed).toHaveBeenCalledWith('The "deleted" action is not supported');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed when issueLimitCommenter is false', async () => {
    await issueCommentAction({
      status: 'valid',
      event: baseCommentEvent,
    }, {
      ...baseConfig,
      issueLimitCommenter: false,
    }, fakeGithub);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed when issue author is unknown', async () => {
    await issueCommentAction({
      status: 'valid',
      event: {
        ...baseCommentEvent,
        issue: {
          ...baseCommentEvent['issue'],
          authorLogin: null,
        },
      },
    }, baseConfig, fakeGithub);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('deletes comment from outsider on gated issue', async () => {
    await issueCommentAction({
      status: 'valid',
      event: baseCommentEvent,
    }, baseConfig, fakeGithub);

    expect(fakeGithub['deleteIssueComment']).toHaveBeenCalledWith('IC_abc123');

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  return;
});

/**
 * Tests - Lib - Action - Issues Action.
 *
 * @since 1.0.1
 */
describe('issuesAction', () => {
  it('sets failed on empty payload', async () => {
    await issuesAction({ status: 'empty' }, baseConfig, [], fakeGithub);

    expect(core.setFailed).toHaveBeenCalledWith('The payload for "issues" is empty');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed on invalid payload', async () => {
    await issuesAction({ status: 'invalid' }, baseConfig, [], fakeGithub);

    expect(core.setFailed).toHaveBeenCalledWith('The payload for "issues" is invalid');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed on unsupported action', async () => {
    await issuesAction({
      status: 'valid',
      event: {
        ...baseIssueEvent,
        action: 'labeled',
      },
    }, baseConfig, [], fakeGithub);

    expect(core.setFailed).toHaveBeenCalledWith('The "labeled" action is not supported');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('skips when issue lacks wanted labels', async () => {
    await issuesAction({
      status: 'valid',
      event: {
        ...baseIssueEvent,
        issue: {
          ...baseIssueEvent['issue'],
          labelNames: ['bug'],
        },
      },
    }, baseConfig, [], fakeGithub);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    expect(core.setFailed).not.toHaveBeenCalled();

    return;
  });

  it('sets failed when opened issue author is unknown', async () => {
    await issuesAction({
      status: 'valid',
      event: {
        ...baseIssueEvent,
        issue: {
          ...baseIssueEvent['issue'],
          authorLogin: null,
        },
      },
    }, baseConfig, [], fakeGithub);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('welcomes a sponsoring user who opens an issue', async () => {
    await issuesAction({
      status: 'valid',
      event: baseIssueEvent,
    }, baseConfig, [{
      type: 'github-api' as const,
      login: 'testUser',
      amount: 500,
    }], fakeGithub);

    expect(fakeGithub['addIssueComment']).toHaveBeenCalledWith('I_abc123', 'Welcome!');

    expect(fakeGithub['closeIssue']).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('welcomes an owner who opens an issue', async () => {
    await issuesAction({
      status: 'valid',
      event: {
        ...baseIssueEvent,
        issue: {
          ...baseIssueEvent['issue'],
          authorRole: 'owner',
        },
      },
    }, baseConfig, [], fakeGithub);

    expect(fakeGithub['addIssueComment']).toHaveBeenCalledWith('I_abc123', 'Welcome!');

    return;
  });

  it('closes and locks an issue from a non-sponsor', async () => {
    await issuesAction({
      status: 'valid',
      event: baseIssueEvent,
    }, baseConfig, [], fakeGithub);

    expect(fakeGithub['addIssueComment']).toHaveBeenCalledWith('I_abc123', 'Not a sponsor.');

    expect(fakeGithub['closeIssue']).toHaveBeenCalledWith('I_abc123');

    expect(fakeGithub['lockIssue']).toHaveBeenCalledWith('I_abc123');

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('still closes and locks when addIssueComment rejects on not-sponsor flow', async () => {
    fakeGithub['addIssueComment'].mockRejectedValueOnce(new Error('GraphQL error'));

    await issuesAction({
      status: 'valid',
      event: baseIssueEvent,
    }, baseConfig, [], fakeGithub);

    expect(core.warning).toHaveBeenCalledWith('Failed to add issue comment, continuing to close and lock');

    expect(fakeGithub['closeIssue']).toHaveBeenCalledWith('I_abc123');

    expect(fakeGithub['lockIssue']).toHaveBeenCalledWith('I_abc123');

    return;
  });

  it('still locks the issue when closeIssue rejects', async () => {
    fakeGithub['closeIssue'].mockRejectedValueOnce(new Error('GraphQL error'));

    await issuesAction({
      status: 'valid',
      event: baseIssueEvent,
    }, baseConfig, [], fakeGithub);

    expect(core.warning).toHaveBeenCalledWith('Failed to close issue, continuing to lock');

    expect(fakeGithub['lockIssue']).toHaveBeenCalledWith('I_abc123');

    return;
  });

  it('locks an issue when closed with lock-on-close enabled', async () => {
    await issuesAction({
      status: 'valid',
      event: {
        ...baseIssueEvent,
        action: 'closed',
      },
    }, baseConfig, [], fakeGithub);

    expect(fakeGithub['lockIssue']).toHaveBeenCalledWith('I_abc123');

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('sets failed when closed and issueLockOnClose is false', async () => {
    await issuesAction({
      status: 'valid',
      event: {
        ...baseIssueEvent,
        action: 'closed',
      },
    }, {
      ...baseConfig,
      issueLockOnClose: false,
    }, [], fakeGithub);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('skips lock when issue is already locked', async () => {
    await issuesAction({
      status: 'valid',
      event: {
        ...baseIssueEvent,
        action: 'closed',
        issue: {
          ...baseIssueEvent['issue'],
          locked: true,
        },
      },
    }, baseConfig, [], fakeGithub);

    expect(fakeGithub['lockIssue']).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  return;
});
