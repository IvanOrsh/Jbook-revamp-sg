import produce from "immer";

import { Cell } from "../cell";
import { ActionType } from "../action-types";
import { Action } from "../actions";

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

const reducer = produce((state: CellsState = initialState, action: Action) => {
  if (action.type === ActionType.UPDATE_CELL) {
    const { id, content } = action.payload;
    state.data[id].content = content;
  }

  if (action.type === ActionType.DELETE_CELL) {
    const idToRemove = action.payload;
    delete state.data[idToRemove];
    state.order = state.order.filter((id) => id !== idToRemove);

    // or
    // const indexInOrder = state.order.findIndex(str => str === idToRemove);
    // if (indexInOrder !== -1) {
    //   state.order.splice(indexInOrder, 0);
    // }
  }

  if (action.type === ActionType.MOVE_CELL) {
    const { direction } = action.payload;
    const index = state.order.findIndex((id) => id === action.payload.id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex > state.order.length - 1) {
      return;
    }

    state.order[index] = state.order[targetIndex];
    state.order[targetIndex] = action.payload.id;
  }

  if (action.type === ActionType.INSERT_CELL_BEFORE) {
    const cell: Cell = {
      content: "",
      type: action.payload.type,
      id: randomId(),
    };
    state.data[cell.id] = cell;

    const foundIndex = state.order.findIndex((id) => id === action.payload.id);
    if (foundIndex < 0) {
      state.order.push(cell.id);
    } else {
      state.order.splice(foundIndex, 0, cell.id);
    }
  }
}, initialState);

// NOT to be moved to utils
const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
