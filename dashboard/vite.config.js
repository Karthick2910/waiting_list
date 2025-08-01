import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/generate': {
        target: 'http://3.110.117.90:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/generate/, '/generate')
      }
    }
  }
})
