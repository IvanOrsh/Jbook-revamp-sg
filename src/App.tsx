import React, { useState } from "react";
import * as esbuild from "esbuild-wasm";

import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugins";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        // it's not going to fix itself
        // "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    if (result.outputFiles) {
      setCode(result.outputFiles[0].text);
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button
          onClick={() => {
            void onClick();
          }}
        >
          Submit
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
