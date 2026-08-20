import * as core from '@actions/core';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { issueCommentAction, issuesAction } from '../lib/action.js';
import {
  getConfig,
  getContext,
  getSponsors,
  getSponsorsExempt,
} from '../lib/utility.js';
import { runAction } from '../run.js';

vi.mock('@actions/core', () => ({
  endGroup: vi.fn(),
  info: vi.fn(),
  setFailed: vi.fn(),
  setOutput: vi.fn(),
  setSecret: vi.fn(),
  startGroup: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('../lib/utility.js', () => ({
  getConfig: vi.fn(),
  getContext: vi.fn(),
  getSponsors: vi.fn().mockResolvedValue([]),
  getSponsorsExempt: vi.fn().mockReturnValue([]),
}));

vi.mock('../lib/action.js', () => ({
  issueCommentAction: vi.fn().mockResolvedValue(undefined),
  issuesAction: vi.fn().mockResolvedValue(undefined),
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

const baseCommentContext = {
  eventName: 'issue_comment',
  payload: { action: 'created' },
};

const baseIssuesContext = {
  eventName: 'issues',
  payload: { action: 'opened' },
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(getConfig).mockReturnValue(baseConfig);

  // @ts-expect-error Partial Context is sufficient for the properties runAction reads.
  vi.mocked(getContext, true).mockReturnValue(baseCommentContext);

  vi.mocked(getSponsors).mockResolvedValue([]);

  vi.mocked(getSponsorsExempt).mockReturnValue([]);

  return;
});

/**
 * Tests - Run - Action.
 *
 * @since 1.0.1
 */
describe('runAction', () => {
  it('routes issue_comment events to issueCommentAction', async () => {
    // @ts-expect-error Partial Context is sufficient for the properties runAction reads.
    vi.mocked(getContext, true).mockReturnValue(baseCommentContext);

    await runAction();

    expect(issueCommentAction).toHaveBeenCalledWith(
      baseCommentContext['payload'],
      baseConfig,
    );

    expect(issuesAction).not.toHaveBeenCalled();

    return;
  });

  it('routes issues events to issuesAction', async () => {
    // @ts-expect-error Partial Context is sufficient for the properties runAction reads.
    vi.mocked(getContext, true).mockReturnValue(baseIssuesContext);

    vi.mocked(getSponsors).mockResolvedValue([{
      type: 'github-api',
      login: 'sponsor1',
      amount: 500,
    }]);

    vi.mocked(getSponsorsExempt).mockReturnValue([{
      type: 'exempt-file',
      login: 'exemptUser',
      amount: null,
    }]);

    await runAction();

    expect(issuesAction).toHaveBeenCalledWith(
      baseIssuesContext['payload'],
      baseConfig,
      [
        {
          type: 'github-api',
          login: 'sponsor1',
          amount: 500,
        },
        {
          type: 'exempt-file',
          login: 'exemptUser',
          amount: null,
        },
      ],
    );

    expect(issueCommentAction).not.toHaveBeenCalled();

    return;
  });

  it('sets failed on unknown event', async () => {
    // @ts-expect-error Partial Context is sufficient for the properties runAction reads.
    vi.mocked(getContext, true).mockReturnValue({
      eventName: 'pull_request',
      payload: {},
    });

    await runAction();

    expect(core.setFailed).toHaveBeenCalledWith('Unknown or unsupported event (pull_request)');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('masks secrets with setSecret', async () => {
    await runAction();

    expect(core.setSecret).toHaveBeenCalledWith('ghp_test123');

    expect(core.setSecret).toHaveBeenCalledWith('ghs_test456');

    return;
  });

  it('catches Error instances and calls setFailed with message', async () => {
    vi.mocked(getSponsors).mockRejectedValue(new Error('Config parse failure'));

    await runAction();

    expect(core.setFailed).toHaveBeenCalledWith('Config parse failure');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('catches non-Error values and calls setFailed with stringified value', async () => {
    vi.mocked(getSponsors).mockRejectedValue('unexpected string error');

    await runAction();

    expect(core.setFailed).toHaveBeenCalledWith('unexpected string error');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('merges GitHub sponsors and exempt sponsors', async () => {
    // @ts-expect-error Partial Context is sufficient for the properties runAction reads.
    vi.mocked(getContext, true).mockReturnValue(baseIssuesContext);

    vi.mocked(getSponsors).mockResolvedValue([
      {
        type: 'github-api',
        login: 'sponsor1',
        amount: 500,
      },
      {
        type: 'github-api',
        login: 'sponsor2',
        amount: 1000,
      },
    ]);

    vi.mocked(getSponsorsExempt).mockReturnValue([{
      type: 'exempt-file',
      login: 'exemptUser',
      amount: null,
    }]);

    await runAction();

    expect(issuesAction).toHaveBeenCalledWith(
      baseIssuesContext['payload'],
      baseConfig,
      [
        {
          type: 'github-api',
          login: 'sponsor1',
          amount: 500,
        },
        {
          type: 'github-api',
          login: 'sponsor2',
          amount: 1000,
        },
        {
          type: 'exempt-file',
          login: 'exemptUser',
          amount: null,
        },
      ],
    );

    return;
  });

  return;
});
