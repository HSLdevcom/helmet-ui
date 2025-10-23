import { defineConfig } from 'vite';
import path from 'path';

import { webcrypto } from "node:crypto";
if (!globalThis.crypto) globalThis.crypto = webcrypto;


export default defineConfig({
  build: {
    outDir: 'dist/main',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main/preload.ts'),
      formats: ['cjs'],
      fileName: () => 'preload.js',
    },
    rollupOptions: {
      external: [
        'electron',
        'fs',
        'path',
        'os',
        'child_process',
        'python-shell',
        'electron-store',
      ],
      output: {
        entryFileNames: 'preload.js',
        format: 'cjs',
      },
    },
    target: 'node20',
    minify: false,
  },
});
