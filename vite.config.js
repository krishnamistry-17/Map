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
      "d189-2405-201-2009-d931-ccd7-677f-2517-e14b.ngrok-free.app",
      // You can add other allowed hosts if necessary
    ],
  },
});
