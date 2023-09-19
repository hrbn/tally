/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

const pwaOptions = {
  mode: 'production',
  base: '/tally',
  manifest: {
    name: 'Tally - Notepad Calculator',
    short_name: 'Tally',
    start_url: '/tally',
    scope: '/tally',
    id: '/tally',
    theme_color: '#25252D',
    background_color: '#25252D',
    display: 'standalone',
    orientation: 'any',
    icons: [
      {
        src: 'public/images/manifest-icon-192.png',
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
        src: 'public/images/manifest-icon-512.png',
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
  publicDir: 'public'
});
