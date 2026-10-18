import { defineConfig } from 'vitest/config';

// Pin the timezone so date results are stable across machines
process.env.TZ = 'UTC';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['test/setup.ts']
  }
});
