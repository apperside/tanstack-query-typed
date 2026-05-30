import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

/**
 * Base path is configurable for sub-path deploys (e.g. GitHub Pages):
 *   BASE_PATH=/tanstack-query-typed/ npm run build
 * Defaults to '/' for root-domain hosting (Vercel / Netlify).
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    // The router plugin must run before @vitejs/plugin-react.
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep the framework runtime in stable, long-cacheable chunks so the
        // route-level code split out by the router stays small. (Function form
        // for Rolldown/Vite 8 compatibility.)
        manualChunks(id) {
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('/node_modules/@tanstack/')) return 'router';
        },
      },
    },
  },
});
