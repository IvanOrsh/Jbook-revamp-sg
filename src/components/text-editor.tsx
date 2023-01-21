/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import MDEditor from "@uiw/react-md-editor";
import React, { useEffect, useState, useRef } from "react";

import "./text-editor.css";

const TextEditor: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("# Click here to start editing");

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
    <div className="text-editor card" ref={ref}>
      {editing ? (
        <div className="card-content">
          <MDEditor value={value} onChange={(v) => setValue(v || "")} />
        </div>
      ) : (
        <div className="text-editor" onClick={() => setEditing(true)}>
          <MDEditor.Markdown source={value} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
