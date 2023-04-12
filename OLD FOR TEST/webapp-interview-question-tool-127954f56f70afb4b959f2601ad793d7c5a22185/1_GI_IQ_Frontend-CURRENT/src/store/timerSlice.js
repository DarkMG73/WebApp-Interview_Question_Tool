import { createSlice } from "@reduxjs/toolkit";

const initState = {
  time: 0,
  timerRunning: false,
  quizInitiated: false,
  peekTimer: 20,
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
      state.timerRunning = true;
    },
    stopTimer: (state) => {
      state.timerRunning = false;
    },
    initiateQuiz: (state) => {
      state.quizInitiated = true;
    },
    peekTimerDecrease: (state) => {
      state.peekTimer = state.peekTimer - 1;
    },
    clearPeekTimer: (state) => {
      return initState;
    },
  },
});

// Action creators are generated for each case reducer function
export const timerActions = timerSlice.actions;

export default timerSlice.reducer;
