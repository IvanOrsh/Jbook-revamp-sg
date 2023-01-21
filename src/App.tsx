import React from "react";
import CodeCell from "./components/code-cell";
import TextEditor from "./components/text-editor";

const App: React.FC = () => {
  return (
    <div className="container">
      <TextEditor />
    </div>
  );
};

export default App;
