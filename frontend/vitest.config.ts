/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Handle JSON imports
  esbuild: {
    loader: 'tsx',
    include: /\.(ts|tsx|js|jsx)$/,
  },
  optimizeDeps: {
    include: ['ethers'],
  },
});
