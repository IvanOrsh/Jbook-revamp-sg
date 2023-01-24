import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CellTypes = "code" | "text";

export type Direction = "up" | "down";

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    updateCell: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },

    deleteCell: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      delete state.data[idToRemove];
      state.order = state.order.filter((id) => id !== idToRemove);
    },

    moveCell: (
      state,
      action: PayloadAction<{ id: string; direction: Direction }>
    ) => {
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
    },

    insertCellAfter: (
      state,
      action: PayloadAction<{ id: string | null; type: CellTypes }>
    ) => {
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: nanoid(),
      };
      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );

      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
    },
  },
});

// slice action creators
export const { deleteCell, moveCell, updateCell, insertCellAfter } =
  cellsSlice.actions;

export default cellsSlice.reducer;
