import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    envCompatible(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      include: ["websocket", "tty", "http"],
    }),
  ],
  build: {
    sourcemap: true,
  },
  define: {
    "process.env": process.env,
  },
  envPrefix: "S_PIPES_",
  resolve: {
    mainFields: [],
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
