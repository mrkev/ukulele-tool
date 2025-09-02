import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// Builds the site
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // components
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "../../docs",
    rollupOptions: {
      input: {
        site: "./index.html",
      },
    },
  },
  // instead of having absolute paths pointing at assets in `index.html`, use
  // relative paths. Works better with github pages where /assets/foobar.js
  // referes to another site
  base: "./",
});
