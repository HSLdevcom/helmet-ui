import { defineConfig } from 'vite';
import path from 'path';

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
    target: 'node16',
    minify: false,
  },
});
