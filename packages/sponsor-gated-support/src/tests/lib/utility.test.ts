import {
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import * as core from '@actions/core';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getConfig, getSponsorsExempt } from '../../lib/utility.js';

vi.mock('@actions/core', () => ({
  debug: vi.fn(),
  getInput: vi.fn(),
  info: vi.fn(),
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

let tempDirectory = '';

beforeEach(() => {
  vi.clearAllMocks();

  tempDirectory = mkdtempSync(join(tmpdir(), 'sponsor-gated-support-'));

  return;
});

afterEach(() => {
  rmSync(tempDirectory, {
    recursive: true,
    force: true,
  });

  return;
});

/**
 * Tests - Lib - Utility - Get Config.
 *
 * @since 2.0.13
 */
describe('getConfig', () => {
  it('parses action inputs into the configuration', () => {
    vi.mocked(core.getInput).mockImplementation((name) => {
      switch (name) {
        case 'GITHUB_PERSONAL_ACCESS_TOKEN': {
          return 'ghp_test123';
        }

        case 'GITHUB_WORKFLOW_TOKEN': {
          return 'ghs_test456';
        }

        case 'SPONSOR_MINIMUM': {
          return '500';
        }

        default: {
          return '';
        }
      }
    });

    expect(getConfig()).toMatchObject({
      githubPersonalAccessToken: 'ghp_test123',
      githubWorkflowToken: 'ghs_test456',
      issueLabels: ['support'],
      sponsorExemptFileLocation: './SPONSOR_EXEMPT',
      sponsorMinimum: 500,
    });

    return;
  });

  return;
});

/**
 * Tests - Lib - Utility - Get Sponsors Exempt.
 *
 * @since 2.0.13
 */
describe('getSponsorsExempt', () => {
  it('reads one login per line and skips blank lines', () => {
    writeFileSync(join(tempDirectory, 'SPONSOR_EXEMPT'), [
      'helper-one',
      '',
      '  helper-two  ',
      '',
    ].join('\n'), 'utf8');

    expect(getSponsorsExempt({
      ...baseConfig,
      sponsorExemptFileLocation: join(tempDirectory, 'SPONSOR_EXEMPT'),
    })).toStrictEqual([
      {
        type: 'exempt-file',
        login: 'helper-one',
        amount: null,
      },
      {
        type: 'exempt-file',
        login: 'helper-two',
        amount: null,
      },
    ]);

    return;
  });

  it('returns an empty list when the file is missing', () => {
    expect(getSponsorsExempt({
      ...baseConfig,
      sponsorExemptFileLocation: join(tempDirectory, 'MISSING'),
    })).toStrictEqual([]);

    expect(core.debug).toHaveBeenCalled();

    return;
  });

  return;
});
