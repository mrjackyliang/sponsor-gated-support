import { runAction } from './run.js';

import type { Index_Initialize_Returns } from './types/index.d.ts';

/**
 * Index - Initialize.
 *
 * Entry point invoked when the bundled action starts. Kicks off
 * the asynchronous action runner and ignores its resolved value.
 *
 * @returns {Index_Initialize_Returns}
 *
 * @since 1.0.1
 */
function initialize(): Index_Initialize_Returns {
  runAction().then(() => {});

  return;
}

initialize();
