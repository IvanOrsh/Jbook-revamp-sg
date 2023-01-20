import React, { useState, useRef } from "react";
import * as esbuild from "esbuild-wasm";

import CodeEditor from "./components/code-editor";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugins";

const App: React.FC = () => {
  const iframe = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    iframe.current.srcdoc = html;

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
      // eslint-disable-next-line
      iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
    }
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.getElementById('root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
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
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

export default App;
