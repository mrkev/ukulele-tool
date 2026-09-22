// Bakes the app's initial HTML into the built index.html.
//
// The site is a single page on GitHub Pages, so there's no server to render
// it; without this the document is an empty <div id="root"> until the bundle
// runs. Crawlers, link previews and readers with slow connections all get the
// chords immediately this way, and main.tsx hydrates on top instead of
// rendering from scratch.
//
// Runs after `vite build`. It spins up Vite's dev pipeline in-process only to
// load src/prerender.tsx with node-side transforms (TSX, the `?url` import,
// the `@` alias); nothing is served.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexHtml = path.resolve(root, "../../docs/index.html");
const MOUNT = '<div id="root"></div>';

const vite = await createServer({
  root,
  configFile: path.join(root, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

try {
  const { render } = await vite.ssrLoadModule("/src/prerender.tsx");
  const html = await fs.readFile(indexHtml, "utf8");
  if (!html.includes(MOUNT)) {
    throw new Error(`${indexHtml} has no ${MOUNT} to render into`);
  }
  const app = render();
  await fs.writeFile(indexHtml, html.replace(MOUNT, `<div id="root">${app}</div>`));
  console.log(`prerendered ${path.relative(root, indexHtml)} (${(app.length / 1024).toFixed(1)} kB)`);
} finally {
  await vite.close();
}
