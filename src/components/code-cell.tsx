import React, { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import { bundle } from "../bundle";
import Resizable from "./resizable";
import { useLazyEffect } from "../hooks/use-lazy-effect";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const { updateCell } = useActions();

  useLazyEffect(
    () => {
      bundle(cell.content)
        .then((output) => {
          setCode(output.code);
          setErr(output.err);
        })
        .catch((err) => console.error(err)); // TODO: this is not going to fix itself
    },
    [cell.content],
    1000
  );

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
