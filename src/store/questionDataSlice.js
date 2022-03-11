import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.allQuestions = null;
  initialState.filteredQuestionsIds = null;
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
      state.filteredQuestionsIds = [];
      state.questionHistory = questionData.questionHistory;
      state.questionMetadata = questionData.questionMetadata;
      state.currentFilters = { level: [], topic: [], tags: [] };
      state.currentQuestionData = {};
    },
    generateNewQuestion: (state) => {
      console.log(
        "%c_____________ %cline:29%cgenerateNewQuestion%c_____________",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px"
      );
      function addCurrentToUsedIds(state) {
        let output = [...state.questionHistory.stats.usedIds];

        if (state.currentQuestionData) {
          const newUsedIdsData = new Set([
            ...state.questionHistory.stats.usedIds,
          ]);
          if (state.currentQuestionData.id)
            newUsedIdsData.add(state.currentQuestionData.id);

          output = Array.from(newUsedIdsData);
        }

        console.log(
          "%c --> %cline:51%cUsed Id's",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
          output
        );
        return output;
      }

      function randomQuestion(state, usedIdsArray) {
        let remainingIds = [...state.filteredQuestionsIds];
        console.log(
          "%c --> %cline:59%cusedIds",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
          usedIdsArray
        );
        usedIdsArray.forEach((id) => {
          const index = remainingIds.indexOf(id);
          console.log(
            "%c BEFORE IF %cline:62%cindex",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
            index
          );
          if (index !== -1) {
            console.log(
              "%c INSIDE IF %cline:62%cindex",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
              index
            );
            remainingIds.splice(index, 1);
          }
        });

        // remainingIds.add(...state.questionMetadata.id);
        const randomNumber = Math.floor(Math.random() * remainingIds.length);
        console.log(
          "%c --> %cline:67%crandomNumber",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
          randomNumber
        );
        console.log(
          "%c --> %cline:62%cremainingIds",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
          remainingIds
        );

        for (const id in remainingIds) {
          if (state.allQuestions[id] === remainingIds[randomNumber]) {
            console.log(
              "%c  for (const id in remainingIds) %cline:73%cstate.allQuestions[id]",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(114, 83, 52);padding:3px;border-radius:2px",
              state.allQuestions[id]
            );
            return state.allQuestions[id];
          }
        }
        console.log(
          "%c --> %cline:117%cstate.allQuestions[remainingIds[randomNumber]]",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
          state.allQuestions[remainingIds[randomNumber]]
        );
        if (state.allQuestions[remainingIds[randomNumber]])
          return state.allQuestions[remainingIds[randomNumber]];

        return false;
      }

      const newUsedIds = addCurrentToUsedIds(state);
      const newQuestion = randomQuestion(state, newUsedIds);

      if (newUsedIds) state.questionHistory.stats.usedIds = newUsedIds;
      if (newQuestion) {
        state.currentQuestionData = newQuestion;
      } else {
        state.currentQuestionData = newQuestion;
        console.log(
          "%c *** NO QUESTIONS LEFT *** %cline:133%cvar",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px"
        );
      }
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
    addToQuestionFilters: (state, action) => {
      state.currentFilters[action.payload.type] = [
        ...state.currentFilters[action.payload.type],
        action.payload.value,
      ];
    },
    removeFromQuestionFilters: (state, action) => {
      let newState = [...state.currentFilters[action.payload.type]];

      newState.splice(newState.indexOf(action.payload.value), 1);
      state.currentFilters[action.payload.type] = newState;
    },
    setQuestionFilterIds: (state, action) => {
      // console.log(
      //   "%c --> %cline:77%caction.payload",
      //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //   "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
      //   action.payload
      // );
      state.filteredQuestionsIds = [...action.payload];
    },
    clearQuestionFilterIds: (state, action) => {
      // console.log(
      //   "%c --> %cline:86%cclearQuestionFilterIds",
      //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //   "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
      //   state
      // );
      // let newState = [...state.filteredQuestionsIds];
      // newState.splice(newState.indexOf(action.payload), 1);
      state.filteredQuestionsIds = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const questionDataActions = questionDataSlice.actions;

export default questionDataSlice.reducer;
