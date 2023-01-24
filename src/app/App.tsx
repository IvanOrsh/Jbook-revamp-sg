import React from "react";
import { Provider } from "react-redux";

import { store } from "./store";
import CellList from "../common/components/CodeList/cell-list";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CellList />
    </Provider>
  );
};

export default App;
