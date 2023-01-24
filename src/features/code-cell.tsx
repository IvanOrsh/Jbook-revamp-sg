import React from "react";

import CodeEditor from "../common/components/CodeEditor/code-editor";
import Preview from "../common/components/Preview/preview";
import Resizable from "../common/components/Resizable/resizable";
import { useLazyEffect } from "../hooks/use-lazy-effect";
import { Cell } from "./cells/cellSlice";
import { useTypedSelector } from "../hooks/use-typed-selectors";
import { useCumulativeCode } from "../hooks/use-cumulative-code";
import { useActions } from "../hooks/use-actions";

import "./code-cell.css";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { createBundle, updateCell } = useActions();

  const bundle = useTypedSelector((state) => state.bundle[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  useLazyEffect(
    () => void createBundle(cell.id, cumulativeCode),
    [cumulativeCode, cell.id],
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
            onChange={(value) =>
              updateCell({
                id: cell.id,
                content: value,
              })
            }
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle?.code} err={bundle?.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
