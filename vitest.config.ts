import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    exclude: ['node_modules', 'dist', '.next', '.output', 'build', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        '.next',
        '.output',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/test/**',
        '**/tests/**',
        '**/__mocks__/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@sociolume/config': path.resolve(__dirname, './packages/config/src'),
      '@sociolume/types': path.resolve(__dirname, './packages/types/src'),
      '@sociolume/utils': path.resolve(__dirname, './packages/utils/src'),
      '@sociolume/ui': path.resolve(__dirname, './packages/ui/src'),
      '@sociolume/auth': path.resolve(__dirname, './packages/auth/src'),
      '@sociolume/db': path.resolve(__dirname, './packages/db/src'),
      '@sociolume/cms': path.resolve(__dirname, './packages/cms/src'),
      '@sociolume/crm': path.resolve(__dirname, './packages/crm/src'),
      '@sociolume/realtime': path.resolve(__dirname, './packages/realtime/src'),
    },
  },
});
