import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@presentation': resolve(__dirname, 'src/presentation'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@services': resolve(__dirname, 'src/services'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@components': resolve(__dirname, 'src/presentation/components')
    }
  },
  server: {
    port: 5174,
    strictPort: true
  },
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_']
})
