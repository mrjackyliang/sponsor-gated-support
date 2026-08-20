import type { Context } from '@actions/github/lib/context';
import type { z } from 'zod';

import type { configuration } from '../lib/schema.js';
import type { Shared_Sponsor } from './shared.d.ts';

/**
 * Run - Run Action.
 *
 * @since 1.0.1
 */
export type Run_RunAction_Returns = Promise<void>;

export type Run_RunAction_Config = z.infer<typeof configuration>;

export type Run_RunAction_Context = Context;

export type Run_RunAction_SponsorsGitHub = Shared_Sponsor[];

export type Run_RunAction_SponsorsExempt = Shared_Sponsor[];

export type Run_RunAction_Sponsors = Shared_Sponsor[];
