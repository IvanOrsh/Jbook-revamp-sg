import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actonCreators } from "../state";

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actonCreators, dispatch);
};
