import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [react(), envCompatible()],
  define: {
    "process.env": process.env,
  },
  resolve: {
    mainFields: [],
  },
  server: {
    proxy: {
      "/public/icons": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public\/icons/, "/public/icons"),
      },
      "/rest": {
        target: "http://localhost:18115/og_spipes",
        ws: true,
      },
    },
  },
});
