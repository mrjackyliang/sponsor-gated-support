import * as core from '@actions/core';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { issueCommentAction, issuesAction } from '../lib/action.js';
import { Runner as GithubAdapter } from '../lib/github.js';
import { getConfig, getSponsorsExempt } from '../lib/utility.js';
import { runAction } from '../run.js';

const fakeGithub = vi.hoisted(() => ({
  addIssueComment: vi.fn(),
  closeIssue: vi.fn(),
  deleteIssueComment: vi.fn(),
  getContext: vi.fn(),
  getSponsors: vi.fn(),
  lockIssue: vi.fn(),
  parseIssueCommentEvent: vi.fn(),
  parseIssuesEvent: vi.fn(),
}));

vi.mock('@actions/core', () => ({
  endGroup: vi.fn(),
  info: vi.fn(),
  setFailed: vi.fn(),
  setOutput: vi.fn(),
  setSecret: vi.fn(),
  startGroup: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('../lib/github.js', () => ({
  Runner: vi.fn(function FakeGithubAdapter() {
    return fakeGithub;
  }),
}));

vi.mock('../lib/utility.js', () => ({
  getConfig: vi.fn(),
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

const parsedCommentEvent = { status: 'invalid' as const };

const parsedIssuesEvent = { status: 'empty' as const };

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(getConfig).mockReturnValue(baseConfig);

  fakeGithub['getContext'].mockReturnValue(baseCommentContext);

  fakeGithub['getSponsors'].mockResolvedValue([]);

  fakeGithub['parseIssueCommentEvent'].mockReturnValue(parsedCommentEvent);

  fakeGithub['parseIssuesEvent'].mockReturnValue(parsedIssuesEvent);

  vi.mocked(getSponsorsExempt).mockReturnValue([]);

  return;
});

/**
 * Tests - Run - Action.
 *
 * @since 1.0.1
 */
describe('runAction', () => {
  it('builds the GitHub adapter from the parsed configuration', async () => {
    await runAction();

    expect(GithubAdapter).toHaveBeenCalledWith(baseConfig);

    return;
  });

  it('routes issue_comment events to issueCommentAction', async () => {
    fakeGithub['getContext'].mockReturnValue(baseCommentContext);

    await runAction();

    expect(fakeGithub['parseIssueCommentEvent']).toHaveBeenCalledWith(baseCommentContext['payload']);

    expect(issueCommentAction).toHaveBeenCalledWith(
      parsedCommentEvent,
      baseConfig,
      fakeGithub,
    );

    expect(issuesAction).not.toHaveBeenCalled();

    return;
  });

  it('routes issues events to issuesAction', async () => {
    fakeGithub['getContext'].mockReturnValue(baseIssuesContext);

    fakeGithub['getSponsors'].mockResolvedValue([{
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

    expect(fakeGithub['parseIssuesEvent']).toHaveBeenCalledWith(baseIssuesContext['payload']);

    expect(issuesAction).toHaveBeenCalledWith(
      parsedIssuesEvent,
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
      fakeGithub,
    );

    expect(issueCommentAction).not.toHaveBeenCalled();

    return;
  });

  it('sets failed on unknown event', async () => {
    fakeGithub['getContext'].mockReturnValue({
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

  it('does not log GitHub or exempt sponsor data', async () => {
    fakeGithub['getContext'].mockReturnValue(baseIssuesContext);

    fakeGithub['getSponsors'].mockResolvedValue([{
      type: 'github-api',
      login: 'privateSponsorLogin',
      amount: 73429,
    }]);

    vi.mocked(getSponsorsExempt).mockReturnValue([{
      type: 'exempt-file',
      login: 'privateExemptLogin',
      amount: null,
    }]);

    await runAction();

    expect(core.info).not.toHaveBeenCalledWith(expect.stringContaining('privateSponsorLogin'));

    expect(core.info).not.toHaveBeenCalledWith(expect.stringContaining('73429'));

    expect(core.info).not.toHaveBeenCalledWith(expect.stringContaining('privateExemptLogin'));

    return;
  });

  it('catches Error instances and calls setFailed with message', async () => {
    fakeGithub['getSponsors'].mockRejectedValue(new Error('Config parse failure'));

    await runAction();

    expect(core.setFailed).toHaveBeenCalledWith('Config parse failure');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('catches non-Error values and calls setFailed with stringified value', async () => {
    fakeGithub['getSponsors'].mockRejectedValue('unexpected string error');

    await runAction();

    expect(core.setFailed).toHaveBeenCalledWith('unexpected string error');

    expect(core.setOutput).toHaveBeenCalledWith('result', false);

    return;
  });

  it('merges GitHub sponsors and exempt sponsors', async () => {
    fakeGithub['getContext'].mockReturnValue(baseIssuesContext);

    fakeGithub['getSponsors'].mockResolvedValue([
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
      parsedIssuesEvent,
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
      fakeGithub,
    );

    return;
  });

  return;
});
