import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { generateSitemap } from 'sitemap-ts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-sitemap',
      closeBundle() {
        const pagesDir = path.resolve(__dirname, 'src/pages');
        const pageFiles = fs.readdirSync(pagesDir);

        const dynamicRoutes = pageFiles
          .filter(file => path.extname(file) === '.tsx')
          .map(file => {
            const route = '/' + path.basename(file, '.tsx').toLowerCase();
            return route === '/home' ? '/' : route;
          });

        generateSitemap({
          hostname: 'https://grampanchayatwathode.com/', // Replace with your actual hostname
          outDir: path.resolve(__dirname, 'dist'),
          readable: true,
          dynamicRoutes,
        });
      },
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
