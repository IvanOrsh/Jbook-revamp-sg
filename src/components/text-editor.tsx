/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import MDEditor from "@uiw/react-md-editor";
import React, { useEffect, useState, useRef } from "react";

import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

import "./text-editor.css";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && e.target && ref.current.contains(e.target as Node)) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  return (
    <div className="card text-editor" ref={ref}>
      {editing ? (
        <div className="card-content">
          <MDEditor
            value={cell.content}
            onChange={(v) => updateCell(cell.id, v || "")}
          />
        </div>
      ) : (
        <div
          className="card-content text-editor"
          onClick={() => setEditing(true)}
        >
          <MDEditor.Markdown source={cell.content || "Click to edit"} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
