import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../app/rootReducers";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
