import { createSlice } from "@reduxjs/toolkit";
import GatherQuestionData from "../hooks/GatherQuestionData";

function InitState() {
  const initialState = {};
  initialState.allQuestions = null;
  initialState.questionHistory = null;
  initialState.questionMetadata = null;
  initialState.currentQuestionData = null;
  return initialState;
}

export const questionDataSlice = createSlice({
  name: "questionData",
  initialState: InitState(),
  reducers: {
    initState: (state, action) => {
      const questionData = GatherQuestionData(action.data);
      state.allQuestions = questionData.allQuestions;
      state.questionHistory = questionData.questionHistory;
      state.questionMetadata = questionData.questionMetadata;

      // state.currentQuestionData = questionData.currentQuestionData;
      console.log("🔵 | initialState", questionData);

      console.log("🔵 | initialState", questionData);
    },
    generateNewQuestion: (state) => {
      // console.log("🟠 | state", JSON.stringify(state, undefined, 2));
      function randomQuestion(state) {
        // console.log("🟣  | state", JSON.stringify(state, undefined, 2));
        const remainingIds = new Set();
        remainingIds.add([
          // ...state.questionHistory.stats.usedIds,
          ...[3, 8, 77, 10],
          // ...state.questionMetadata.id,
        ]);
        // remainingIds.add(...state.questionMetadata.id);
        const remainingIdsArray = Array.from(remainingIds);
        const randomNumber = Math.floor(
          Math.random() * remainingIdsArray[0].length
        );
        console.log(
          "🟢 | randomQuestion | remainingIds[randomNumber]",
          remainingIdsArray
        );
        console.log(
          "🟢 | randomQuestion | remainingIds[randomNumber]",
          randomNumber
        );
        return state.allQuestions[remainingIdsArray[0][randomNumber]];
      }
      const newQuestion = randomQuestion(state);
      console.log("🟡 | newQuestion", newQuestion);
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
export const counterActions = questionDataSlice.actions;

export default questionDataSlice.reducer;
