import React from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { useLazyEffect } from "../hooks/use-lazy-effect";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selectors";

import "./code-cell.css";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
    import _React from 'react';
    import { createRoot as _createRoot } from 'react-dom/client';

    var show = (value) => {
      const container = document.getElementById('root');

      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          const root = _createRoot(container);
          root.render(value);
        } else {
          container.innerHTML = JSON.stringify(value);
        }
      } else {
        container.innerHTML = value;
      }
    };
    `;

    const showFuncNoop = "var show = () => {}";

    const cumulativeCode = [];

    for (const c of orderedCells) {
      if (c.type === "code") {
        const sjow = c.id === cell.id ? showFunc : showFuncNoop;
        cumulativeCode.push(sjow);
        cumulativeCode.push(c.content);
      }

      if (c.id === cell.id) {
        break;
      }
    }
    return cumulativeCode;
  });

  useLazyEffect(
    () => {
      createBundle(cell.id, cumulativeCode.join("\n"));
    },
    [cumulativeCode.join("\n"), cell.id],
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
