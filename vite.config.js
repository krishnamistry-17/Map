import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-map-gl", "mapbox-gl"],
  },
  server: {
    allowedHosts: [
      "b43e-2405-201-2009-d931-4901-6cb4-42b6-2d32.ngrok-free.app",
      // You can add other allowed hosts if necessary
    ],
  },
});
