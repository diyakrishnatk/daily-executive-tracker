import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Fallback to index.html for SPA routing (React Router)
    historyApiFallback: true,
  }
})
