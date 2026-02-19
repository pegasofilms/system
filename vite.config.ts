import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [vue(), viteWrapCodeInIIFE({ files: ['pegasofilmsapp.js'] })],
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