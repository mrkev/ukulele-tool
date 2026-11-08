import tailwindcss from "@tailwindcss/vite";
import { execSync } from "node:child_process";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

function git(args: string) {
  try {
    return execSync(`git ${args}`, {
      cwd: import.meta.dirname,
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

// Builds the site
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // What this build was made from, shown in the settings drawer.
  define: {
    "import.meta.env.VITE_BUILD_COMMIT": JSON.stringify(
      git("rev-parse --short HEAD")
    ),
    // Uncommitted changes to the site at build time.
    "import.meta.env.VITE_BUILD_DIRTY": JSON.stringify(
      git("status --porcelain -- .") !== ""
    ),
  },

  // components
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
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
