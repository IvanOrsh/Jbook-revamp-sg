import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "state"; // oldschool redux

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
