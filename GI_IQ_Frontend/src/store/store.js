import { configureStore } from "@reduxjs/toolkit";
import questionDataReducer from "./questionDataSlice";
import timerReducer from "./timerSlice";
import loginStatusReducer from "./loginStatusSlice";
import authReducer from "./authSlice";
import loadingRequestsReducer from "./loadingRequestsSlice";

export default configureStore({
  reducer: {
    questionData: questionDataReducer,
    timer: timerReducer,
    loginStatus: loginStatusReducer,
    auth: authReducer,
    loadingRequests: loadingRequestsReducer,
  },
});
