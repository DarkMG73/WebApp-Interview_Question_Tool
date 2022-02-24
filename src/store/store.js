import { configureStore } from "@reduxjs/toolkit";
import questionDataReducer from "./questionDataSlice";

export default configureStore({
  reducer: {
    questionData: questionDataReducer,
  },
});
