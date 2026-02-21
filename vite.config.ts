import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['img/logo.png'],
      manifest: {
        name: 'PEGASO FILMS NOPALA',
        short_name: 'PEGASO FILMS',
        description: 'PEGASO FILMS NOPALA - Grabación de eventos',
        theme_color: '#1a1a2e',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'es',
        start_url: './',
        scope: './',
        icons: [
          { src: 'img/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'img/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    viteWrapCodeInIIFE({ files: ['pegasofilmsapp.js'] }),
  ],
  server: {
    port: 5173,
    host: true, // Permite acceso desde la red local
    open: true, // Abre el navegador automáticamente
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        format: 'es', // Use ES Modules format
        entryFileNames: `pegasofilmsapp.js`,
        chunkFileNames: `pegasofilmsapp-[hash].js`,
        assetFileNames: `pegasofilmsapp.[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

interface ViteWrapCodeInIIFEOptions {
  files?: string[]
}

function viteWrapCodeInIIFE(options: ViteWrapCodeInIIFEOptions = {}) {
  return {
    name: 'vite-wrap-code-in-iife',
    apply: 'build' as 'build',
    enforce: 'post' as 'post',
    generateBundle({}, bundle: { [fileName: string]: { type: string; code?: string } }) {
      for (const [fileName, chunkOrAsset] of Object.entries(bundle) as [string, { type: string; code?: string }][]) {
        if (chunkOrAsset.type === 'chunk' && options.files && options.files.includes(fileName)) {
          chunkOrAsset.code = `(function () {${chunkOrAsset.code}})();`
        }
      }
    },
  }
}