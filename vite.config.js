
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
  "zealous-troublously-carole.ngrok-free.dev"
],
    proxy: {
      "/api": {
        target: "https://qr-attendance-api.koyeb.app",
        changeOrigin: true
      }
    }
  }
});