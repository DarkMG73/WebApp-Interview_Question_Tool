import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CardPrimarySquareTop from "./UI/Cards/CardPrimary/CardPrimarySquareTop";
import Header from "./Components/Header/Header";
import Nav from "./Components/Nav/Nav";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import GatherQuestionData from "./hooks/GatherQuestionData";
import { questionDataActions } from "./store/questionDataSlice";
import { authActions } from "./store/authSlice";
import AllQuestions from "./pages/AllQuestions/AllQuestions";
import StudyTopicsTool from "./pages/StudyTopicsTool/StudyTopicsTool";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import {
  getUserCookie,
  sign_inAUser,
  getUserUserByToken,
} from "./storage/userDB";
import { loadingRequestsActions } from "./store/loadingRequestsSlice";
import { ErrorBoundary } from "./HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { statusUpdateActions } from "./store/statusUpdateSlice";
import { updateUserHistory } from "./storage/userDB";
import storage from "./storage/storage";

function App() {
  const dispatch = useDispatch();
  // const allQuestionsData = GatherQuestionData();
  const currentState = useSelector((state) => state.questionData);
  const currentStatus = useSelector((state) => state.statusUpdate);
  const [initialLoggedInUser, setInitialLoggedInUser] = useState(false);
  const { user, recentLogout } = useSelector((state) => state.auth);
  const { questionHistory, currentFilters, ...otherQuestionData } = useSelector(
    (state) => state.questionData
  );
  const makeLoadingRequest = function () {
    return dispatch(loadingRequestsActions.addToLoadRequest());
  };
  const removeLoadingRequest = function () {
    dispatch(loadingRequestsActions.removeFromLoadRequest());
  };
  const [localError, setLocalError] = useState({
    title: null,
    active: false,
    message: null,
  });

  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  const runGatherQuestionData = (user) => {
    makeLoadingRequest();
    GatherQuestionData(user)
      .then((data) => {
        if (process.env.NODE_ENV === "development")
          console.log(
            "%c Getting tool data from DB:",
            "color:#fff;background:#777;padding:14px;border-radius:0 25px 25px 0",
            data
          );
        dispatch(questionDataActions.initState(data));
        if (currentStatus.status === null) {
          dispatch(
            statusUpdateActions.updateStatus({
              status: currentStatus.status,
              statusText: "OK. Saving to Browser Storage.",
              rateLimitRemaining: currentStatus.rateLimitRemaining,
            })
          );
        }
      })
      .catch((err) => {
        console.log(
          "%c --> GatherToolData: err: ",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        if (err.hasOwnProperty("status") && err.status >= 500) {
          setLocalError({
            active: true,
            message:
              " *** " +
              err.statusText +
              `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`,
          });
        } else if (err.hasOwnProperty("status")) {
          console.log(
            "%c --> %cline:55%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(114, 83, 52);padding:3px;border-radius:2px",
            err
          );
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              err.request.responseURL,
          });
        } else {
          console.log(
            "%c --> %cline:66%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
            err
          );

          const responseURL =
            err.hasOwnProperty("request") &&
            err.request.hasOwnProperty("responseURL")
              ? err.request.responseURL
              : "";
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              responseURL,
          });
        }
      });

    removeLoadingRequest();
  };

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////

  ////////
  // Initial check for logged-in user
  // and data grab.
  ///////
  useEffect(() => {
    getUserCookie()
      .then((res) => {
        console.log(
          "%c --> %cline:141%cres",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
          res
        );
        if (res.status >= 400) {
          runGatherQuestionData();
        } else {
          getUserUserByToken(res.data.cookie)
            .then((userProfile) => {
              if (userProfile.status >= 400) {
                runGatherQuestionData();
              } else {
                dispatch(
                  authActions.logIn({
                    ...userProfile,
                    token: res.data.cookie,
                  })
                );
              }
            })
            .catch((err) => {
              console.log(
                "%c --> GatherToolData: err: ",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
                err
              );
            });
        }
      })
      .catch((err) => {
        console.log(
          "%c --> GatherToolData: err: ",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        setLocalError({
          active: true,
          message: " An error: " + err.toString(),
        });
      });
  }, []);

  useEffect(() => {
    if (user) {
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
      runGatherQuestionData(user);
      // console.log(
      //   "%c --> %cline:165%cnewUserHistory",
      //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //   "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
      //   newUserHistory
      // );
    } else {
      console.log(
        "%c --> %cline:188%celse",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
        user
      );

      runGatherQuestionData();
    }
  }, [user, dispatch]);

  useEffect(() => {
    console.log(
      "%c --> %cline:224%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
      user
    );
    if (user) {
      console.log(
        "%c --> %cline:28%cuser",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
        user
      );
      console.log(
        "%c --> %cline:38%cquestionHistory",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
        questionHistory
      );

      updateUserHistory({
        user,
        dataObj: questionHistory,

        currentFiltersObj: currentFilters,
      });
    } else if (recentLogout) {
      console.log(
        "%c --> %cline:30%crecentLogout",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
        recentLogout
      );
      dispatch(authActions.resetRecentLogout());
      const browserSessionHistory = storage("GET");
      const newQuestionHistory = browserSessionHistory.hasOwnProperty(
        "questionHistory"
      )
        ? browserSessionHistory.questionHistory
        : {
            incorrect: {},
            correct: {},
            unmarked: {},
            stats: {},
          };

      dispatch(questionDataActions.updateQuestionHistory(newQuestionHistory));
    } else {
      console.log(
        "%c --> %cline:63%celse",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px"
      );
      storage("ADD", { questionHistory, currentFilters, ...otherQuestionData });
    }
  }, [questionHistory, currentFilters]);

  if (
    currentState.allQuestions &&
    (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
  ) {
    // const updateState = currentState;
    // console.log(
    //   "%ccurrentState.allQuestions: ",
    //   "color:#fff;background:#64bbe3;padding:14px;border-radius:0 25px 25px 0",
    //   currentState.allQuestions
    // );
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
