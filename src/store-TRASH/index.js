import { configureStore } from "@reduxjs/toolkit";

import questionDataReducer from "./questionDataSlice";

const store = configureStore({
  reducer: { counter: questionDataReducer },
});

export default store;
