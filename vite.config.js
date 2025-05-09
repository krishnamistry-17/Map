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
      "9496-2405-201-2009-d931-652c-7bda-94de-62d4.ngrok-free.app",
      // You can add other allowed hosts if necessary
    ],
  },
});
