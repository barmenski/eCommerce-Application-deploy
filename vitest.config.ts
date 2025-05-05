import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'happy-dom',
    environment: 'happy-dom',
    setupFiles: ['src/tests/tests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
