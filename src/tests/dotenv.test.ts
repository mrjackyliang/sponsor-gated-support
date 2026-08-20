import { registerDotenvSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Dotenv.
 *
 * This project self-checks its own `.env` / `.env.sample` quote convention
 * THROUGH the published kit. The suite logic lives in @cbnventures/nova/rules/vitest;
 * this wrapper supplies the configuration that reproduces this project's conventions.
 *
 * @since 0.21.0
 */
registerDotenvSuite({
  vitest,
  enable: 'all',
});
