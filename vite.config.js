import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [react(), envCompatible()],
  build: {
    sourcemap: true,
  },
  define: {
    "process.env": process.env,
  },
  envPrefix: "S_PIPES_",
  resolve: {
    alias: {
      "@config": "/src/config",
    },
  },
  server: {
    proxy: {
      "/rest": {
        target: "http://localhost:18115/og_spipes",
        ws: true,
      },
    },
  },
});
