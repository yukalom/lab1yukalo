import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5000,
    open: "/app.html",
  },
  build: {
    rollupOptions: {
      input: "app.html",
    },
  },
});
