import { runAction } from './run.js';

/**
 * Index - Initialize.
 *
 * Entry point invoked when the bundled action starts. Kicks off
 * the asynchronous action runner and ignores its resolved value.
 *
 * @since 1.0.1
 */
function initialize() {
  runAction().then(() => {});

  return;
}

initialize();
