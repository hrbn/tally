import { defineConfig } from 'vitest/config';

// Pin the timezone so date results are stable across machines
process.env.TZ = 'UTC';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['test/setup.ts'],
    coverage: {
      // Bun runs on JavaScriptCore, so V8 coverage isn't available
      provider: 'istanbul',
      // The calculation logic; UI code isn't unit tested
      include: [
        'src/hooks/preprocess.ts',
        'src/hooks/format.ts',
        'src/hooks/evaluate.ts',
        'src/components/Maths.ts',
        'src/data/currency.ts',
      ],
      reporter: ['text', 'html'],
      // Set just below current coverage so regressions fail the run
      statements: 82,
      lines: 81,
      branches: 83,
      functions: 60,
    },
  },
});
