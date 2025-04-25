import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectRegister: 'auto',
      devOptions: {
        enabled: true, // Enables SW in development for testing
        type: 'module',
      },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 10 * 1024 ** 2,
        globPatterns: ['**/*.{js,css,html,wasm,data}'],
      },
      includeAssets: ['favicon.ico', 'logo.png', 'logo-cropped.png'],
      manifest: {
        theme_color: '#8936FF',
        background_color: '#2EC6FE',
        icons: [
          { purpose: 'maskable', sizes: '512x512', src: 'icon512_maskable.png', type: 'image/png' },
          { purpose: 'any', sizes: '512x512', src: 'icon512_rounded.png', type: 'image/png' },
        ],
        orientation: 'any',
        display: 'standalone',
        lang: 'fr-FR',
        name: 'medTrack',
        short_name: 'medTrack',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
  worker: {
    format: 'es',
  },
})
