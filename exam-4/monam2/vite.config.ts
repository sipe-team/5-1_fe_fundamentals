import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['nuqs'],
  },
  optimizeDeps: {
    exclude: ['nuqs', 'nuqs/adapters/react'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
