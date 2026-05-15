import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'lib'),
      components: path.resolve(__dirname, 'components'),
      data: path.resolve(__dirname, 'data'),
    },
  },
});
