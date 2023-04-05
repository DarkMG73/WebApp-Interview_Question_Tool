import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import StudyTopicsTool from "./pages/StudyTopicsTool/StudyTopicsTool";
import CardPrimarySquareTop from "./UI/Cards/CardPrimary/CardPrimarySquareTop";
import Header from "./Components/Header/Header";
import Nav from "./Components/Nav/Nav";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import storage from "./storage/storage";
import { authActions } from "./store/authSlice";
import AllQuestions from "./pages/AllQuestions/AllQuestions";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { questionDataActions } from "./store/questionDataSlice";
import { ErrorBoundary } from "./HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { useUserDataInit } from "./Hooks/useUserDataInit";
import { useRunGatherQuestionData } from "./Hooks/useRunGatherQuestionData";

function App() {
  const dispatch = useDispatch();
  // const allQuestionsData = GatherQuestionData();
  const currentState = useSelector((state) => state.questionData);
  const [user, setUser] = useState();
  const { userLoggedIn = user, recentLogout, recentLogin } = useSelector(
    (state) => state.auth
  );
  console.log(
    "%c --> %cline:23%cuuserLoggedIn",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
    userLoggedIn
  );

  console.log(
    "%c --> %cline:23%crecentLogout",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
    recentLogout
  );
  const [localError, setLocalError] = useState({
    title: null,
    active: false,
    message: null,
  });
  const userDataInit = useUserDataInit();
  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  const runGatherQuestionData = useRunGatherQuestionData();

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////

  ///////
  // Initial user & data setup.
  // Login user if needed (triggers data setup on user change).
  // If no user, initiate data gathering.
  useEffect(() => {
    userDataInit({ setLocalError, setUser });
  }, []);

  // If user status changes take action.
  useEffect(() => {
    console.log(
      "%c --> %cline:156%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
      user
    );
    if (user === "not logged in") {
      console.log(
        "%c --> %cline:157%cuser--NONE",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
        user
      );
      runGatherQuestionData({ user: false, setLocalError, setUser });
    } else if (user) {
      dispatch(authActions.logIn(user));
      // const newUserHistory = user.hasOwnProperty("questionHistory")
      //   ? user.questionHistory
      //   : {
      //       incorrect: {},
      //       correct: {},
      //       unmarked: {},
      //       stats: {},
      //     };
      // dispatch(questionDataActions.updateQuestionHistory(newUserHistory));
      runGatherQuestionData({ user, setLocalError, setUser });
      // console.log(
      //   "%c --> %cline:165%cnewUserHistory",
      //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //   "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
      //   newUserHistory
      // );
    }
  }, [user, dispatch]);

  // useEffect(() => {
  //   if (recentLogout) {
  //     dispatch(authActions.resetRecentLogout());
  //     const browserSessionHistory = storage("GET");
  //     console.log(
  //       "%c --> %cline:104%cuser",
  //       "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //       "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //       "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
  //       user
  //     );
  //     console.log(
  //       "%c --> %cline:93%cbrowserSessionHistory",
  //       "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //       "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //       "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
  //       browserSessionHistory
  //     );
  //     const newQuestionHistory = browserSessionHistory.hasOwnProperty(
  //       "questionHistory"
  //     )
  //       ? browserSessionHistory.questionHistory
  //       : {
  //           incorrect: {},
  //           correct: {},
  //           unmarked: {},
  //           stats: {},
  //         };
  //     runGatherQuestionData({ user, setLocalError, setUser });

  //     dispatch(questionDataActions.updateQuestionHistory(newQuestionHistory));
  //   }
  // }, [recentLogout]);
  // useEffect(() => {
  //   if (recentLogin && user) {
  //     dispatch(authActions.resetRecentLogin());
  //     const newQuestionHistory = user.hasOwnProperty("questionHistory")
  //       ? user.questionHistory
  //       : {
  //           incorrect: {},
  //           correct: {},
  //           unmarked: {},
  //           stats: {},
  //         };
  //     console.log(
  //       "%c --> %cline:104%cuser",
  //       "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //       "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //       "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
  //       user
  //     );
  //     console.log(
  //       "%c --> %cline:93%cnewQuestionHistory",
  //       "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //       "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //       "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
  //       newQuestionHistory
  //     );

  //     runGatherQuestionData({ user, setLocalError, setUser });

  //     // dispatch(questionDataActions.updateQuestionHistory(newQuestionHistory));
  //   }
  // }, [recentLogin, user]);

  useEffect(() => {
    setUser(userLoggedIn);
  }, [userLoggedIn]);

  if (
    currentState.allQuestions &&
    (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
  ) {
    // const updateState = currentState;
    console.log(
      "%ccurrentState.allQuestions: ",
      "color:#fff;background:#64bbe3;padding:14px;border-radius:0 25px 25px 0",
      currentState.allQuestions
    );
  }

  return (
    <div className="App">
      <ErrorBoundary>
        <header className="App-header">
          <CardPrimarySquareTop>
            {" "}
            {currentState.questionMetadata && <Header />}
          </CardPrimarySquareTop>
        </header>
      </ErrorBoundary>
      <ErrorBoundary>
        <Routes>
          {currentState.allQuestions && (
            <Route path="/list-of-all-questions" element={<AllQuestions />} />
          )}
          {currentState.allQuestions && (
            <Route path="/study-topics-tool" element={<StudyTopicsTool />} />
          )}
          {currentState.allQuestions && <Route path="/" element={<Home />} />}
          {!currentState.allQuestions && (
            <Route path="/" element={<BarLoader />} />
          )}
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
