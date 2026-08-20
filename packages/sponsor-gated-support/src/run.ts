import util from 'node:util';

import * as core from '@actions/core';

import { issueCommentAction, issuesAction } from './lib/action.js';
import {
  getConfig,
  getContext,
  getSponsors,
  getSponsorsExempt,
} from './lib/utility.js';

import type {
  Run_RunAction_Config,
  Run_RunAction_Context,
  Run_RunAction_Returns,
  Run_RunAction_Sponsors,
  Run_RunAction_SponsorsExempt,
  Run_RunAction_SponsorsGitHub,
} from './types/run.d.ts';

/**
 * Run - Action.
 *
 * Loads configuration and context, gathers sponsors, then routes
 * the triggering event to the matching issue or comment handler.
 *
 * @returns {Run_RunAction_Returns}
 *
 * @since 1.0.1
 */
export async function runAction(): Run_RunAction_Returns {
  try {
    const config: Run_RunAction_Config = getConfig();

    core.setSecret(config['githubPersonalAccessToken']);
    core.setSecret(config['githubWorkflowToken']);

    const context: Run_RunAction_Context = getContext();
    const sponsorsGitHub: Run_RunAction_SponsorsGitHub = await getSponsors(config);
    const sponsorsExempt: Run_RunAction_SponsorsExempt = getSponsorsExempt(config);
    const sponsors: Run_RunAction_Sponsors = [
      ...sponsorsGitHub,
      ...sponsorsExempt,
    ];

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
      case 'issue_comment': {
        await issueCommentAction(context.payload, config);
        break;
      }

      case 'issues': {
        await issuesAction(context.payload, config, sponsors);
        break;
      }

      default: {
        core.setFailed(`Unknown or unsupported event (${context.eventName})`);

        core.setOutput('result', false);

        break;
      }
    }

    core.endGroup();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }

    core.setOutput('result', false);
  }

  return;
}
