import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

// The build bakes the initial render into index.html (see scripts/prerender.mjs),
// so attach to that markup rather than replacing it.
ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
