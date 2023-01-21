import React, { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import { bundle } from "../bundle";
import Resizable from "./resizable";
import { useLazyEffect } from "../hooks/use-lazy-effect";

const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  useLazyEffect(
    () => {
      bundle(input)
        .then((output) => setCode(output))
        .catch((err) => console.error(err));
    },
    [input],
    1000
  );

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
