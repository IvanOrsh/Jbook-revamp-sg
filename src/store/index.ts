import { configureStore } from "@reduxjs/toolkit";
import { cellsSlice } from "./cellSlice";

export const store = configureStore({
  reducer: { cells: cellsSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
