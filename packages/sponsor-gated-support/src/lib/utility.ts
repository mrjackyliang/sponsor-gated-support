import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import * as core from '@actions/core';

import { configuration } from './schema.js';

import type {
  Lib_Utility_GetConfig_Returns,
  Lib_Utility_GetSponsorsExempt_Config,
  Lib_Utility_GetSponsorsExempt_Exempts,
  Lib_Utility_GetSponsorsExempt_File,
  Lib_Utility_GetSponsorsExempt_Returns,
  Lib_Utility_GetSponsorsExempt_SponsorExemptFileLocation,
} from '../types/lib/utility.d.ts';

/**
 * Lib - Utility - Get Config.
 *
 * Reads every action input from the workflow environment and
 * validates them into a typed configuration object.
 *
 * @returns {Lib_Utility_GetConfig_Returns}
 *
 * @since 1.0.1
 */
export function getConfig(): Lib_Utility_GetConfig_Returns {
  return configuration.parse({
    githubPersonalAccessToken: core.getInput('GITHUB_PERSONAL_ACCESS_TOKEN'),
    githubWorkflowToken: core.getInput('GITHUB_WORKFLOW_TOKEN'),
    issueLabels: core.getInput('ISSUE_LABELS'),
    issueLimitCommenter: core.getInput('ISSUE_LIMIT_COMMENTER'),
    issueLockOnClose: core.getInput('ISSUE_LOCK_ON_CLOSE'),
    issueMessageNotSponsor: core.getInput('ISSUE_MESSAGE_NOT_SPONSOR'),
    issueMessageWelcome: core.getInput('ISSUE_MESSAGE_WELCOME'),
    isOrganization: core.getInput('IS_ORGANIZATION'),
    sponsorActiveOnly: core.getInput('SPONSOR_ACTIVE_ONLY'),
    sponsorExemptFileLocation: core.getInput('SPONSOR_EXEMPT_FILE_LOCATION'),
    sponsorMinimum: core.getInput('SPONSOR_MINIMUM'),
  });
}

/**
 * Lib - Utility - Get Sponsors Exempt.
 *
 * Reads the optional exempt file and returns each listed login as
 * a sponsor entry, returning an empty list when the file is absent.
 *
 * @param {Lib_Utility_GetSponsorsExempt_Config} config - Config.
 *
 * @returns {Lib_Utility_GetSponsorsExempt_Returns}
 *
 * @since 1.0.1
 */
export function getSponsorsExempt(config: Lib_Utility_GetSponsorsExempt_Config): Lib_Utility_GetSponsorsExempt_Returns {
  const sponsorExemptFileLocation: Lib_Utility_GetSponsorsExempt_SponsorExemptFileLocation = config['sponsorExemptFileLocation'];

  try {
    const file: Lib_Utility_GetSponsorsExempt_File = readFileSync(resolve(sponsorExemptFileLocation), 'utf8');
    const exempts: Lib_Utility_GetSponsorsExempt_Exempts = file.split('\n');

    return exempts.map((exempt) => ({
      type: 'exempt-file' as const,
      login: exempt.trim(),
      amount: null,
    })).filter((exempt) => exempt['login'] !== '');
  } catch {
    core.debug(`"${sponsorExemptFileLocation}" not found. Skipping...`);

    return [];
  }
}
