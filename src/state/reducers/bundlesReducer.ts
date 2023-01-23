import produce from "immer";

import { ActionType } from "../action-types";
import { Action } from "../actions";

interface BundlesState {
  [key: string]: {
    loading: boolean; // bundling
    code: string;
    error: string;
  };
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action) => {
    if (action.type === ActionType.BUNDLE_START) {
      //..
    }

    if (action.type === ActionType.BUNDLE_COMPLETE) {
      // ..
    }
  },
  initialState
);

export default reducer;
