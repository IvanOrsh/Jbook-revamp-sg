import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type CellTypes = "code" | "text";

type Direction = "up" | "down";

interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}

interface CellsState {
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

export const cellsSlice = createSlice({
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

    insertCellBefore: (
      state,
      action: PayloadAction<{ id: string; type: CellTypes }>
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
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }
    },
  },
});

export const { updateCell, deleteCell, moveCell, insertCellBefore } =
  cellsSlice.actions;
