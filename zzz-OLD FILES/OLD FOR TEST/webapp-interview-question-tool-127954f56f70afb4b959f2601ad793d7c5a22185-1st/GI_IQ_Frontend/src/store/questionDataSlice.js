import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.allQuestions = null;
  initialState.filteredQuestionsIds = null;
  initialState.questionHistory = null;
  initialState.questionMetadata = null;
  initialState.currentQuestionData = null;
  initialState.currentFilters = null;
  initialState.studyNotes = null;
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
      state.currentFilters = questionData.currentFilters;
      state.studyNotes = questionData.studyNotes;
      state.currentQuestionData = {};
    },
    generateNewQuestion: (state) => {
      function randomQuestion(state, usedIdsArray) {
        // const usedIds = [
        //   ...state.questionHistory.stats.usedIds,
        // ];
        // ensure no duplicates in filteredIds
        // let  filteredIds = new Set([...state.filteredQuestionsIds]);
        // const  = Array.from(filteredIds)
        // remainingIds
        let remainingIds = [...state.filteredQuestionsIds];

        usedIdsArray.forEach((id) => {
          const index = remainingIds.indexOf(id);

          if (index !== -1) {
            remainingIds.splice(index, 1);
          }
        });

        // remainingIds.add(...state.questionMetadata.identifier);
        const randomNumber = Math.floor(Math.random() * remainingIds.length);

        for (const id in remainingIds) {
          if (state.allQuestions[id] === remainingIds[randomNumber]) {
            return state.allQuestions[id];
          }
        }

        if (state.allQuestions[remainingIds[randomNumber]])
          return state.allQuestions[remainingIds[randomNumber]];

        return false;
      }

      const usedIds = [...state.questionHistory.stats.usedIds];
      const newQuestion = randomQuestion(state, usedIds);

      if (usedIds) state.questionHistory.stats.usedIds = usedIds;
      if (newQuestion) {
        state.currentQuestionData = newQuestion;
      } else {
        const refreshIds = window.confirm(
          'Congratulations! You have completed all of the questions in your chosen levels, topics and tags. To keep answering new questions, click "CANCEL" here and use the "Question Filter" to increase your selected questions. Or, click "OK" here to cycle back through the same questions and get another shot at 100% correct! Clicking "OK" will not erase your session history.'
        );

        if (refreshIds) {
          state.questionHistory.stats.usedIds = [];
          const newQuestion = randomQuestion(state, []);
          state.currentQuestionData = newQuestion;
        } else {
          state.currentQuestionData = "no questions";
        }
      }
    },
    addToHistoryCorrect: (state) => {
      const currentQuestionId = state.currentQuestionData.identifier;

      // Clear question from history
      const {
        [currentQuestionId]: idToDiscardUnmarked,
        ...newUnmarked
      } = state.questionHistory.unmarked;
      state.questionHistory.unmarked = newUnmarked;
      const {
        [currentQuestionId]: idToDiscardIncorrect,
        ...newIncorrect
      } = state.questionHistory.incorrect;
      state.questionHistory.incorrect = newIncorrect;

      // Add back to appropriate history
      state.questionHistory.correct = {
        ...state.questionHistory.correct,
        [currentQuestionId]: state.currentQuestionData,
      };
    },
    addToHistoryIncorrect: (state) => {
      const currentQuestionId = state.currentQuestionData.identifier;

      // Clear question from history
      const {
        [currentQuestionId]: idToDiscardUnmarked,
        ...newUnmarked
      } = state.questionHistory.unmarked;
      state.questionHistory.unmarked = newUnmarked;
      const {
        [currentQuestionId]: idToDiscardCorrect,
        ...newCorrect
      } = state.questionHistory.correct;
      state.questionHistory.correct = newCorrect;

      // Add back to appropriate history
      state.questionHistory.incorrect = {
        ...state.questionHistory.incorrect,
        [currentQuestionId]: state.currentQuestionData,
      };
    },
    addToHistoryUnmarked: (state) => {
      const currentQuestionId = state.currentQuestionData.identifier;
      // Add to used ID's
      const newUsedIdsData = new Set([...state.questionHistory.stats.usedIds]);
      if (currentQuestionId) {
        newUsedIdsData.add(state.currentQuestionData.identifier);
        const newUsedIdsArray = Array.from(newUsedIdsData);
        state.questionHistory.stats.usedIds = newUsedIdsArray;
      }

      // Clear question from history
      const {
        [currentQuestionId]: idToDiscardIncorrect,
        ...newIncorrect
      } = state.questionHistory.incorrect;
      state.questionHistory.incorrect = newIncorrect;
      const {
        [currentQuestionId]: idToDiscardCorrect,
        ...newCorrect
      } = state.questionHistory.correct;
      state.questionHistory.correct = newCorrect;

      // Add back to appropriate history
      state.questionHistory.unmarked = {
        ...state.questionHistory.unmarked,
        [currentQuestionId]: state.currentQuestionData,
      };
    },
    updateQuestionHistory: (state, action) => {
      const newQuestionHistory = action.payload;
      // Update newQuestionHistory
      state.questionHistory = newQuestionHistory;
    },
    addStudyTopicID: (state, action) => {
      console.log(
        "%c --> %cline:165%caddStudyNote",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
        action.payload
      );

      console.log(
        "%c --> %cline:167%cstate.studyNotes.studyTopics",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
        state.studyNotes.studyTopics
      );

      const newStudyTopics = [
        ...state.studyNotes.studyTopicsIDs,
        action.payload,
      ];
      // Update newQuestionHistory
      state.studyNotes.studyTopicsIDs = newStudyTopics;
    },
    clearStudyTopicsIDs: (state, action) => {
      state.studyNotes.studyTopicsIDs = [];
    },
    updateStudyNotes: (state, action) => {
      console.log(
        "%c --> %cline:165%caddStudyNote",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
        action.payload
      );

      console.log(
        "%c --> %cline:167%cstate.studyNotes.studyTopics",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
        state.studyNotes.studyNotes
      );

      state.studyNotes.studyNotes = [action.payload];
    },
    clearStudyNotes: (state, action) => {
      state.studyNotes.studyNotes = [];
      console.log(
        "%c --> %cline:205%cstate.studyNotes.",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
        state.studyNotes
      );
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
      state.filteredQuestionsIds = [...action.payload];
    },
    clearQuestionFilterIds: (state, action) => {
      state.filteredQuestionsIds = [];
    },
  },
});
function addCurrentToUsedIds(state) {
  const newUsedIdsData = new Set([...state.questionHistory.stats.usedIds]);
  let output = [...newUsedIdsData];
  console.log(
    "%c --> %cline:29%coutput",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px",
    output
  );
  console.log(
    "%c --> %cline:41%cstate.currentQuestionData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
    state.currentQuestionData
  );
  if (state.currentQuestionData) {
    if (state.currentQuestionData.identifier)
      newUsedIdsData.add(state.currentQuestionData.identifier);

    output = Array.from(newUsedIdsData);
  }

  return output;
}
// Action creators are generated for each case reducer function
export const questionDataActions = questionDataSlice.actions;

export default questionDataSlice.reducer;
