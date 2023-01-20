import { createRoot } from "react-dom/client";
import * as esbuild from "esbuild-wasm";

import App from "./App";

new Promise((res) => setTimeout(res, 100))
  .then(() =>
    esbuild.initialize({
      worker: true,
      // "esbuild-wasm": "^0.17.2" this one should match the one below
      wasmURL: "https://unpkg.com/esbuild-wasm@0.17.2/esbuild.wasm",
    })
  )
  .then(() => {
    const root = createRoot(document.getElementById("root") as HTMLElement);
    root.render(<App />);
  })
  .catch((err) => console.error(err));
