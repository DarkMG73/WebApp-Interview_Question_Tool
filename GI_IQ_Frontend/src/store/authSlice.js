import { createSlice } from "@reduxjs/toolkit";

const initState = {
  user: false,
  authToken: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    logIn: (state, action) => {
      console.log(
        "%c --> %cline:13%caction.payload",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
        action.payload
      );
      state.user = action.payload;

      state.authToken = action.payload.token;
    },
    logOut: (state) => {
      return initState;
    },
  },
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

export default authSlice.reducer;
