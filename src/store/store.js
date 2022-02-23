import { createStore } from "redux";
import questionDataReducer from "./questionDataSlice";

const store = createStore(questionDataReducer);

export default store;
