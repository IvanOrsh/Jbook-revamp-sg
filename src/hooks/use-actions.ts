import { useMemo } from "react";
import { bindActionCreators } from "redux";

import { useAppDispatch } from "../app/hooks";
import * as actionCreators from "../features/action-creators";

export const useActions = () => {
  const dispatch = useAppDispatch();

  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
