import produce from "immer";

import { ActionType } from "../action-types";
import { Action } from "../actions";

interface BundlesState {
  [key: string]: {
    loading: boolean; // bundling
    code: string;
    err: string;
  };
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action) => {
    if (action.type === ActionType.BUNDLE_START) {
      state[action.payload.cellId] = {
        loading: true,
        code: "",
        err: "",
      };
    }

    if (action.type === ActionType.BUNDLE_COMPLETE) {
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.code,
        err: action.payload.bundle.err,
      };
    }
  },
  initialState
);

export default reducer;
