import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    server: {
        port: 5000,
        open: "app.html"
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "app.html")
            }
        }
    }
});