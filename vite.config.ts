import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(import.meta.dirname, './node_modules/react'),
      'react-dom': path.resolve(import.meta.dirname, './node_modules/react-dom'),
    },
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@monaco-editor/react'],
    exclude: ['pyodide'],
  },
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.message && warning.message.includes('has been externalized for browser compatibility')) {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
});
