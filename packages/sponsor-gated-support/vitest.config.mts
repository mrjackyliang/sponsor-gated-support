import { VitestCoverage } from '@cbnventures/nova/toolkit';
import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration.
 *
 * @since 1.0.1
 */
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/tests/**/*.test.ts'],
    globals: false,
    testTimeout: 30000, // 30 seconds.
    coverage: VitestCoverage.options(),
  },
});
