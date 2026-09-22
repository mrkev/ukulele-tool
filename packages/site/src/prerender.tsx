import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App.tsx";

// Entry for scripts/prerender.mjs. Renders the same tree main.tsx hydrates, so
// the two must stay in step or React will discard the markup and re-render.
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
