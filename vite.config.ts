import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5128,
  },
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "react-helmet-async",
      "@sudobility/components",
      "@sudobility/building_blocks",
    ],
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-helmet-async": path.resolve(
        __dirname,
        "node_modules/react-helmet-async",
      ),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
