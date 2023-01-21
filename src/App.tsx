import React, { useState, useRef } from "react";

import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundle";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button
          onClick={() => {
            void onClick();
          }}
        >
          Submit
        </button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default App;
