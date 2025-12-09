import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permet à Docker d'accéder au port
    port: 5173,
    watch: {
      usePolling: true //nécessaire sur Windows/WSL pour le hot-reload
    }
  }
})