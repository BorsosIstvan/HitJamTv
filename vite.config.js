import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/video-stream-v1/', // Kulcsfontosságú a GitHub Pages-hez!
})
