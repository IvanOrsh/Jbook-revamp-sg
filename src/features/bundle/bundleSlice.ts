import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IBundleStart {
  cellId: string;
}

interface IBundleComplete {
  cellId: string;
  bundle: {
    code: string;
    err: string;
  };
}

interface BundlesState {
  [key: string]:
    | {
        loading: boolean; // bundling
        code: string;
        err: string;
      }
    | undefined;
}

const initialState: BundlesState = {};

export const bundleSlice = createSlice({
  name: "bundle",
  initialState,
  reducers: {
    bundleStart: (state: BundlesState, action: PayloadAction<IBundleStart>) => {
      state[action.payload.cellId] = {
        loading: true,
        code: "",
        err: "",
      };
    },
    bundleComplete: (
      state: BundlesState,
      action: PayloadAction<IBundleComplete>
    ) => {
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.code,
        err: action.payload.bundle.err,
      };
    },
  },
});

// slice action creators
export const { bundleStart, bundleComplete } = bundleSlice.actions;

export default bundleSlice.reducer;
