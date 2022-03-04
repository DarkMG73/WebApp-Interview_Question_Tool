import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.allQuestions = null;
  initialState.filteredQuestions = null;
  initialState.questionHistory = null;
  initialState.questionMetadata = null;
  initialState.currentQuestionData = null;
  initialState.currentFilters = null;
  return initialState;
}

export const questionDataSlice = createSlice({
  name: "questionData",
  initialState: InitState(),
  reducers: {
    initState: (state, action) => {
      const questionData = action.payload;
      state.allQuestions = questionData.allQuestions;
      state.filteredQuestions = questionData.allQuestions;
      state.questionHistory = questionData.questionHistory;
      state.questionMetadata = questionData.questionMetadata;
      state.currentFilters = {};
    },
    generateNewQuestion: (state) => {
      function randomQuestion(state) {
        const remainingIds = new Set();
        remainingIds.add([
          ...state.questionHistory.stats.usedIds,

          ...state.questionMetadata.id,
        ]);
        // remainingIds.add(...state.questionMetadata.id);
        const remainingIdsArray = Array.from(remainingIds);
        const randomNumber = Math.floor(
          Math.random() * remainingIdsArray[0].length
        );

        for (const i in state.allQuestions) {
          if (state.allQuestions[i].id === remainingIdsArray[0][randomNumber]) {
            return state.allQuestions[i];
          }
        }

        return state.allQuestions[remainingIdsArray[0][randomNumber]];
      }
      const newQuestion = randomQuestion(state);

      state.currentQuestionData = newQuestion;
    },
    addToHistoryCorrect: (state) => {
      state.addToHistoryCorrect[state.currentQuestionData.id] =
        state.currentQuestionData;
    },
    addToHistoryIncorrect: (state) => {
      state.addToHistoryIncorrect[state.currentQuestionData.id] =
        state.currentQuestionData;
    },
    addToHistoryUnmarked: (state) => {
      state.addToHistoryUnmarked[state.currentQuestionData.id] =
        state.currentQuestionData;
    },
  },
});

// Action creators are generated for each case reducer function
export const questionDataActions = questionDataSlice.actions;

export default questionDataSlice.reducer;
