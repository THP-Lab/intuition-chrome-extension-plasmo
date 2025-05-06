import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import webExtension from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~/assets': path.resolve(__dirname, 'assets')
    }
  },
  plugins: [
    react(),
    webExtension({
      manifest,
      contentScripts: {
        preambleCode: false
      }
    })
  ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})