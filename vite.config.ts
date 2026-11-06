import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' + HashRouter = funciona em qualquer repositório do GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom', 'zustand'], charts: ['recharts'] },
      },
    },
  },
});
