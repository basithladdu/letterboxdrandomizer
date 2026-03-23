import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/lb-proxy': {
        target: 'https://letterboxd.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lb-proxy/, ''),
      },
      '/omdb-proxy': {
        target: 'https://www.omdbapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/omdb-proxy/, ''),
      },
    },
  },
})
