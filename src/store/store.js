import { configureStore } from "@reduxjs/toolkit";
import questionDataReducer from "./questionDataSlice";
import timerReducer from "./timerSlice";

export default configureStore({
  reducer: {
    questionData: questionDataReducer,
    timer: timerReducer,
  },
});
