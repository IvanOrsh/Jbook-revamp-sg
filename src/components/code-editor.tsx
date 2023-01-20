/* eslint-disable */
import { useRef } from "react";
import MonacoEditor, { Monaco, OnMount, OnChange } from "@monaco-editor/react";
import monaco from "monaco-editor";
import prettier from "prettier";
import parser from "prettier/parser-babel";

import "./code-editor.css";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const onEditorDidMount: OnMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    //@ts-ignore
    editorRef.current = editor;
    editorRef.current.getModel()?.updateOptions({
      tabSize: 2,
    });
  };

  const onEditorChange: OnChange = (
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) => {
    if (value) {
      onChange(value);
    }
  };

  const onFormatClick = () => {
    const toBeFormatted = editorRef.current?.getModel()?.getValue();

    if (toBeFormatted) {
      const formatted = prettier
        .format(toBeFormatted, {
          parser: "babel",
          plugins: [parser],
          useTabs: false,
          semi: true,
          singleQuote: true,
        })
        .replace(/\n$/, "");

      editorRef.current?.setValue(formatted);
    }
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        onMount={onEditorDidMount}
        onChange={onEditorChange}
        language="javascript"
        height="500px"
        theme="vs-dark"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
