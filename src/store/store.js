import { configureStore } from "@reduxjs/toolkit";
import questionDataReducer from "./questionDataSlice";
import timerReducer from "./timerSlice";
import loginStatusReducer from "./loginStatusSlice";

export default configureStore({
  reducer: {
    questionData: questionDataReducer,
    timer: timerReducer,
    loginStatus: loginStatusReducer,
  },
});
