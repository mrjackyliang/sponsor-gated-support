import type { z } from 'zod';

import type { configuration } from '../../lib/schema.js';
import type { Shared_Sponsor } from '../shared.d.ts';

/**
 * Lib - Utility - Get Config.
 *
 * @since 1.0.1
 */
export type Lib_Utility_GetConfig_Returns = z.infer<typeof configuration>;

/**
 * Lib - Utility - Get Sponsors Exempt.
 *
 * @since 1.0.1
 */
export type Lib_Utility_GetSponsorsExempt_Config = z.infer<typeof configuration>;

export type Lib_Utility_GetSponsorsExempt_Returns = Shared_Sponsor[];

export type Lib_Utility_GetSponsorsExempt_SponsorExemptFileLocation = string;

export type Lib_Utility_GetSponsorsExempt_File = string;

export type Lib_Utility_GetSponsorsExempt_Exempts = string[];
