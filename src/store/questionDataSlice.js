import { createSlice } from "@reduxjs/toolkit";
import { gatherQuestionData } from "../hooks/gather-question-data";
const {
  allQuestions,
  questionHistory,
  questionMetadata,
} = gatherQuestionData();
console.log("🔵 | allQuestions", allQuestions);
console.log("🔵 | questionHistory", questionHistory);
console.log("🔵 | questionMetadata", questionMetadata);

const initialState = gatherQuestionData();
initialState.currentQuestionData = null;

export const questionDataSlice = createSlice({
  name: "questionData",
  initialState: initialState,
  reducers: {
    generateNewQuestion: (state) => {
      function randomQuestion() {
        const remainingIds = new Set();
        remainingIds.add(state.questionHistory.stats.usedIds);
        remainingIds.add(state.questionMetadata.id);
        const remainingIdsArray = Array.from(remainingIds);
        const randomNumber = Math.floor(
          Math.random() * (remainingIdsArray - 1).length
        );
        return state.allQuestions[remainingIds[randomNumber]];
      }
      state.currentQuestionData = randomQuestion();
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
export const {
  generateNewQuestion,
  addToHistoryCorrect,
  addToHistoryIncorrect,
  addToHistoryUnmarked,
} = questionDataSlice.actions;

export default questionDataSlice.reducer;
