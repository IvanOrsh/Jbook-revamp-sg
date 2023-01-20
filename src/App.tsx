import React, { useState } from "react";
import * as esbuild from "esbuild-wasm";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = () =>
    esbuild
      .transform(input, {
        loader: "jsx",
        target: "es2015",
      })
      .then((result) => {
        setCode(result.code);
      });

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
