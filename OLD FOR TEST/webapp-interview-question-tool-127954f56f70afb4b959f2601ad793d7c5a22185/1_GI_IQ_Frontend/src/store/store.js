import { configureStore } from "@reduxjs/toolkit";
import questionDataReducer from "./questionDataSlice";
import timerReducer from "./timerSlice";
import authReducer from "./authSlice";
import loadingRequestsReducer from "./loadingRequestsSlice";
import statusUpdateReducer from "./statusUpdateSlice";

export default configureStore({
  reducer: {
    questionData: questionDataReducer,
    timer: timerReducer,
    auth: authReducer,
    loadingRequests: loadingRequestsReducer,
    statusUpdate: statusUpdateReducer,
  },
});
