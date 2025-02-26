import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), envCompatible(), tsconfigPaths()],
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
      "@components": "/src/components",
      "@constants": "/src/constants",
      "@layouts": "/src/layouts",
      "@pages": "/src/pages",
      "@rest": "/src/rest",
    },
  },
});
