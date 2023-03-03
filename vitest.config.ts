import { defineConfig, } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    exclude: [
      'build',
      'dev-build',
      'node_modules',
      'website',
    ],
    globals: true,
    mockReset: true,
    restoreMocks: true,
    watch: false,
  },
});
