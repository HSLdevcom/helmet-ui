import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './src/renderer', // renderer source
  base: './',
  build: {
    outDir: './dist/', // where the bundled files go
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
    },
  },
  plugins: [react()],
  define: {
    'process.env': {},
  },
});
