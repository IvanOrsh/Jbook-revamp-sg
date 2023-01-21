import React, { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import { bundle } from "../bundle";
import Resizable from "./resizable";
import { useLazyEffect } from "../hooks/use-lazy-effect";

const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  useLazyEffect(
    () => {
      bundle(input)
        .then((output) => {
          setCode(output.code);
          setErr(output.err);
        })
        .catch((err) => console.error(err)); // TODO: this is not going to fix itself
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
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
