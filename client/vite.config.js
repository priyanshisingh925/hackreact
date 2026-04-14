import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy is used in local dev (node start.js). In production on Render,
    // set VITE_API_URL env var to your backend service URL at build time.
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true }
    }
  },
  define: {
    // Exposes VITE_API_URL to the React bundle at build time.
    // If not set, defaults to '' (relative URLs — works via proxy locally).
    __API_BASE__: JSON.stringify(process.env.VITE_API_URL || '')
  }
})