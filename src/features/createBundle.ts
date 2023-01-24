import { Dispatch } from "react";
import { bundle } from "./bundle/bundle-esmbuild/index";
import { bundleSlice } from "./bundle/bundleSlice";

type SliceActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer A ? A : never;
}[keyof T];

type ActionTypes = SliceActions<typeof bundleSlice.actions>;

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<ActionTypes>) => {
    dispatch({
      type: "bundle/bundleStart",
      payload: {
        cellId,
      },
    });

    const result = await bundle(input);

    dispatch({
      type: "bundle/bundleComplete",
      payload: {
        cellId,
        bundle: result,
      },
    });
  };
};
