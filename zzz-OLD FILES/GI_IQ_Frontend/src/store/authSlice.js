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
      console.log(
        "%c --> %cline:30%cresetRecentLogout",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px"
      );
      state.recentLogout = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

export default authSlice.reducer;
