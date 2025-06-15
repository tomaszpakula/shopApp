import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    hmr: {
      port: 5173,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
