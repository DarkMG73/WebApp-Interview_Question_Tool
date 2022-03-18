import { createSlice } from "@reduxjs/toolkit";

const initState = {
  time: 0,
  timerRunning: false,
  quizInitiated: false,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState: initState,
  reducers: {
    add: (state) => {
      state.time = state.time + 1;
    },
    clearTimer: (state) => {
      return initState;
    },
    startTimer: (state) => {
      console.log(
        "%c $$$$$$$$$ IN SLICE $$$$$$$$$$ %cline:18%cstartTimer",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px"
      );
      state.timerRunning = true;
    },
    stopTimer: (state) => {
      console.log(
        "%c $$$$$$$$$ IN SLICE $$$$$$$$$$ %cline:18%cstopTimer",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px"
      );
      state.timerRunning = false;
    },
    initiateQuiz: (state) => {
      state.quizInitiated = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const timerActions = timerSlice.actions;

export default timerSlice.reducer;
