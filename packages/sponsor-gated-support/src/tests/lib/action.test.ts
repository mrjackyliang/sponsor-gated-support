import * as core from '@actions/core';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { issueCommentAction, issuesAction } from '../../lib/action.js';
import {
  addIssueComment,
  closeIssue,
  deleteIssueComment,
  lockIssue,
} from '../../lib/utility.js';

vi.mock('@actions/core', () => ({
  setFailed: vi.fn(),
  setOutput: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('../../lib/utility.js', () => ({
  addIssueComment: vi.fn().mockResolvedValue(undefined),
  closeIssue: vi.fn().mockResolvedValue(undefined),
  deleteIssueComment: vi.fn().mockResolvedValue(undefined),
  lockIssue: vi.fn().mockResolvedValue(undefined),
}));

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

const supportLabel = {
  color: 'fc0',
  default: false,
  description: null,
  id: 1,
  name: 'support',
  node_id: 'LA_abc',
  url: 'https://api.github.com/labels/support',
};

const bugLabel = {
  color: 'd73a4a',
  default: false,
  description: null,
  id: 2,
  name: 'bug',
  node_id: 'LA_bug',
  url: 'https://api.github.com/labels/bug',
};

const baseCommentPayload = {
  action: 'created',
  comment: {
    author_association: 'NONE',
    node_id: 'IC_abc123',
    user: { login: 'outsider' },
  },
  issue: {
    labels: [supportLabel],
    user: { login: 'issueOwner' },
  },
};

const baseIssuePayload = {
  action: 'opened',
  issue: {
    author_association: 'NONE',
    labels: [supportLabel],
    locked: false,
    node_id: 'I_abc123',
    user: { login: 'testUser' },
  },
};

beforeEach(() => {
  vi.clearAllMocks();

  return;
});

/**
 * Tests - Lib - Action - Issue Comment Action.
 *
 * @since 1.0.1
 */
describe('issueCommentAction', () => {
  it('sets failed on empty payload', async () => {
    await issueCommentAction({}, baseConfig);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('skips when issue lacks wanted labels', async () => {
    await issueCommentAction({
      ...baseCommentPayload,
      issue: {
        ...baseCommentPayload['issue'],
        labels: [bugLabel],
      },
    }, baseConfig);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    expect(core.setFailed).not.toHaveBeenCalled();

    return;
  });

  it('skips when commenter is the issue creator', async () => {
    await issueCommentAction({
      ...baseCommentPayload,
      comment: {
        ...baseCommentPayload['comment'],
        user: { login: 'issueOwner' },
      },
    }, baseConfig);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('skips when commenter is an owner', async () => {
    await issueCommentAction({
      ...baseCommentPayload,
      comment: {
        ...baseCommentPayload['comment'],
        author_association: 'OWNER',
      },
    }, baseConfig);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('sets failed when comment or issue user is null', async () => {
    await issueCommentAction({
      ...baseCommentPayload,
      comment: {
        ...baseCommentPayload['comment'],
        user: null,
      },
    }, baseConfig);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed on unsupported action', async () => {
    await issueCommentAction({
      ...baseCommentPayload,
      action: 'deleted',
    }, baseConfig);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed when issueLimitCommenter is false', async () => {
    await issueCommentAction(baseCommentPayload, {
      ...baseConfig,
      issueLimitCommenter: false,
    });

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed when issue user is null', async () => {
    await issueCommentAction({
      ...baseCommentPayload,
      issue: {
        ...baseCommentPayload['issue'],
        user: null,
      },
    }, baseConfig);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed on non-empty but structurally invalid payload', async () => {
    await issueCommentAction({
      action: 'created',
      comment: 'not-an-object',
    }, baseConfig);

    expect(core.setFailed).toHaveBeenCalledWith('The payload for "issue_comment" is invalid');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('deletes comment from outsider on gated issue', async () => {
    await issueCommentAction(baseCommentPayload, baseConfig);

    expect(deleteIssueComment).toHaveBeenCalledWith('IC_abc123', baseConfig);

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
    await issuesAction({}, baseConfig, []);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('sets failed on unsupported action', async () => {
    await issuesAction({
      ...baseIssuePayload,
      action: 'labeled',
    }, baseConfig, []);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('skips when issue lacks wanted labels', async () => {
    await issuesAction({
      ...baseIssuePayload,
      issue: {
        ...baseIssuePayload['issue'],
        labels: [bugLabel],
      },
    }, baseConfig, []);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    expect(core.setFailed).not.toHaveBeenCalled();

    return;
  });

  it('sets failed when opened issue user is null', async () => {
    await issuesAction({
      ...baseIssuePayload,
      issue: {
        ...baseIssuePayload['issue'],
        user: null,
      },
    }, baseConfig, []);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('welcomes a sponsoring user who opens an issue', async () => {
    await issuesAction(baseIssuePayload, baseConfig, [{
      type: 'github-api' as const,
      login: 'testUser',
      amount: 500,
    }]);

    expect(addIssueComment).toHaveBeenCalledWith('I_abc123', 'Welcome!', baseConfig);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('welcomes an owner who opens an issue', async () => {
    await issuesAction({
      ...baseIssuePayload,
      issue: {
        ...baseIssuePayload['issue'],
        author_association: 'OWNER',
      },
    }, baseConfig, []);

    expect(addIssueComment).toHaveBeenCalledWith('I_abc123', 'Welcome!', baseConfig);

    return;
  });

  it('closes and locks an issue from a non-sponsor', async () => {
    await issuesAction(baseIssuePayload, baseConfig, []);

    expect(addIssueComment).toHaveBeenCalledWith('I_abc123', 'Not a sponsor.', baseConfig);

    expect(closeIssue).toHaveBeenCalledWith('I_abc123', baseConfig);

    expect(lockIssue).toHaveBeenCalledWith('I_abc123', baseConfig);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('still closes and locks when addIssueComment rejects on not-sponsor flow', async () => {
    vi.mocked(addIssueComment).mockRejectedValueOnce(new Error('GraphQL error'));

    await issuesAction(baseIssuePayload, baseConfig, []);

    expect(core.warning).toHaveBeenCalledWith('Failed to add issue comment, continuing to close and lock');

    expect(closeIssue).toHaveBeenCalledWith('I_abc123', baseConfig);

    expect(lockIssue).toHaveBeenCalledWith('I_abc123', baseConfig);

    return;
  });

  it('still locks the issue when closeIssue rejects', async () => {
    vi.mocked(closeIssue).mockRejectedValueOnce(new Error('GraphQL error'));

    await issuesAction(baseIssuePayload, baseConfig, []);

    expect(core.warning).toHaveBeenCalledWith('Failed to close issue, continuing to lock');

    expect(lockIssue).toHaveBeenCalledWith('I_abc123', baseConfig);

    return;
  });

  it('locks an issue when closed with lock-on-close enabled', async () => {
    await issuesAction({
      ...baseIssuePayload,
      action: 'closed',
      issue: {
        ...baseIssuePayload['issue'],
        locked: false,
      },
    }, baseConfig, []);

    expect(lockIssue).toHaveBeenCalledWith('I_abc123', baseConfig);

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  it('sets failed when closed and issueLockOnClose is false', async () => {
    await issuesAction({
      ...baseIssuePayload,
      action: 'closed',
    }, {
      ...baseConfig,
      issueLockOnClose: false,
    }, []);

    expect(core.setFailed).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('skips lock when issue is already locked', async () => {
    await issuesAction({
      ...baseIssuePayload,
      action: 'closed',
      issue: {
        ...baseIssuePayload['issue'],
        locked: true,
      },
    }, baseConfig, []);

    expect(lockIssue).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith('result', true);

    return;
  });

  return;
});
