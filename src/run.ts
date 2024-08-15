import * as core from '@actions/core';
import util from 'node:util';

import { issueCommentAction, issuesAction } from '@/lib/action.js';
import {
  getConfig,
  getContext,
  getSponsors,
  getSponsorsExempt,
} from '@/lib/utility.js';
import type { RunActionReturns } from '@/types/index.d.ts';

/**
 * Run action.
 *
 * @returns {RunActionReturns}
 *
 * @since 1.0.0
 */
export async function runAction(): RunActionReturns {
  try {
    const config = getConfig();
    const context = getContext();
    const sponsorsGitHub = await getSponsors(config);
    const sponsorsExempt = getSponsorsExempt(config);
    const sponsors = [...sponsorsGitHub, ...sponsorsExempt];

    // Configuration logs.
    core.startGroup('Configuration');
    core.info(util.inspect(config, false, null, true));
    core.endGroup();

    // Context logs.
    core.startGroup('Context');
    core.info(util.inspect(context, false, null, true));
    core.endGroup();

    // Sponsors logs.
    core.startGroup('Sponsors');
    core.info(util.inspect(sponsors, false, null, true));
    core.endGroup();

    // Run the appropriate action based on context event.
    core.startGroup('Running');

    switch (context.eventName) {
      case 'issue_comment':
        await issueCommentAction(context.payload, config);
        break;
      case 'issues':
        await issuesAction(context.payload, config, sponsors);
        break;
      default:
        core.setFailed(`Unknown or unsupported event (${context.eventName})`);
        break;
    }

    core.endGroup();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
