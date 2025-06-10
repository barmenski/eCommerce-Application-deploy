import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'jsdom',
    environment: 'jsdom',
    setupFiles: ['src/tests/tests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/*.config.js'],
  },
});
