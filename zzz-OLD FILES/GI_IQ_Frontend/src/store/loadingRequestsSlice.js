import { createSlice } from "@reduxjs/toolkit";

const initState = {
  pendingLoadRequests: 0,
};

export const loadingRequestsSlice = createSlice({
  name: "loadingRequests",
  initialState: initState,
  reducers: {
    addToLoadRequest: (state, action) => {
      const currentValue = state.pendingLoadRequests;
      state.pendingLoadRequests = currentValue + 1;
    },
    removeFromLoadRequest: (state) => {
      const currentValue = state.pendingLoadRequests;

      const newCurrentValue = currentValue - 1 < 0 ? 0 : currentValue - 1;
      state.pendingLoadRequests = newCurrentValue;
    },
  },
});

// Action creators are generated for each case reducer function
export const loadingRequestsActions = loadingRequestsSlice.actions;

export default loadingRequestsSlice.reducer;
