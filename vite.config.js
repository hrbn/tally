/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

const pwaOptions = {
  mode: 'development',
  base: '/',
  manifest: {
    name: 'Tally - Notepad Calculator',
    short_name: 'Tally',
    start_url: '/',
    scope: '/',
    id: '/',
    theme_color: '#1f2228',
    background_color: '#1f2228',
    display: 'standalone',
    orientation: 'any',
    icons: [
      {
        src: 'public/images/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'public/images/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'public/images/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'public/images/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
};

export default defineConfig({
  base: '/tally',
  plugins: [
    react(),
    visualizer({
      emitFile: true,
      filename: 'stats.html'
    }),
    VitePWA(pwaOptions)
  ],
  server: {
    open: '/index.html'
  },
  build: {
    sourcemap: false,
    target: 'esnext'
  },
  publicDir: 'public'
});
