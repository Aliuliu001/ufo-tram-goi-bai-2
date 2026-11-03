import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative assets also work at /ufo-tram-goi-bai/ on GitHub Pages.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  build: { outDir: 'dist', emptyOutDir: true },
  server: { host: '0.0.0.0' },
});
