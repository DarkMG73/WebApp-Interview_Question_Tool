import { createSlice } from "@reduxjs/toolkit";

const initState = {
  user: false,
  authToken: false,
  recentLogout: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    logIn: (state, action) => {
      state.recentLogin = true;
      state.user = action.payload;
      if (action.payload && action.payload.hasOwnProperty("token"))
        state.authToken = action.payload.token;
    },
    logOut: (state) => {
      const recentLogoutState = { ...initState };
      recentLogoutState.recentLogout = true;
      return recentLogoutState;
    },
    resetRecentLogout: (state) => {
      state.recentLogout = false;
    },
    resetRecentLogin: (state) => {
      state.recentLogin = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

export default authSlice.reducer;
