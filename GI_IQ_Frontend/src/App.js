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
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import {
  getUserCookie,
  sign_inAUser,
  getUserUserByToken,
} from "./storage/userDB";
import { loadingRequestsActions } from "./store/loadingRequestsSlice";
import { ErrorBoundary } from "./HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";

function App() {
  const dispatch = useDispatch();
  // const allQuestionsData = GatherQuestionData();
  const currentState = useSelector((state) => state.questionData);
  const [user, setUser] = useState(false);
  const userLoggedIn = useSelector((state) => state.auth.user);
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
  useEffect(() => {
    getUserCookie()
      .then((res) => {
        if (res.status >= 400) {
          runGatherQuestionData();
        } else {
          getUserUserByToken(res.data.cookie)
            .then((userProfile) => {
              if (userProfile.status >= 400) {
                runGatherQuestionData();
              } else {
                setUser({ ...userProfile, token: res.data.cookie });
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
      console.log(
        "%c --> %cline:156%cuser",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
        user
      );
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
    }
  }, [user, dispatch]);

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
