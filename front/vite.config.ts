import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Permet à Docker d'accéder au port
    port: 5173,
    watch: {
      usePolling: true, //nécessaire sur Windows/WSL pour le hot-reload
    },
  },
});
