import { combineReducers } from "@reduxjs/toolkit";

import bundleReducer from "../features/bundle/bundleSlice";
import cellsReducer from "../features/cells/cellSlice";

const rootReducer = combineReducers({
  cells: cellsReducer,
  bundle: bundleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
