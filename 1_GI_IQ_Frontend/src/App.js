import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import StudyTopicsTool from "./pages/StudyTopicsTool/StudyTopicsTool";
import StudyNotesPage from "./pages/StudyNotesPage/StudyNotesPage";
import CardPrimarySquareTop from "./UI/Cards/CardPrimary/CardPrimarySquareTop";
import Header from "./Components/Header/Header";
import Nav from "./Components/Nav/Nav";
import storage from "./storage/storage";
import { authActions } from "./store/authSlice";
import AllQuestions from "./pages/AllQuestions/AllQuestions";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { ErrorBoundary } from "./HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { useUserDataInit } from "./Hooks/useUserDataInit";
import { useRunGatherQuestionData } from "./Hooks/useRunGatherQuestionData";
import axios from "axios";
import { loadingRequestsActions } from "./store/loadingRequestsSlice";
import { statusUpdateActions } from "./store/statusUpdateSlice";

function App() {
  const dispatch = useDispatch();
  // const allQuestionsData = GatherQuestionData();
  const { allQuestions, questionMetadata } = useSelector(
    (state) => state.questionData
  );

  const [user, setUser] = useState();
  const { userLoggedIn = user, recentLogout, recentLogin } = useSelector(
    (state) => state.auth
  );
  const [localError, setLocalError] = useState({
    title: null,
    active: false,
    message: null,
  });
  const userDataInit = useUserDataInit();
  const [noDBErrors, setNoDBErrors] = useState({
    status: true,
    message: "All is well.",
  });

  ////////////////////////////////////////
  /// Network Communication
  ////////////////////////////////////////
  axios.interceptors.request.use(
    (request) => {
      dispatch(loadingRequestsActions.addToLoadRequest());
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      const serverRateLimitRemaining = response.headers["ratelimit-remaining"];
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(
          "%cRate Limit Remaining: ",
          "color:#fff;background:#ccd62d;padding:5px;border-radius:0 25px 25px 0",
          serverRateLimitRemaining
        );
      }
      dispatch(loadingRequestsActions.removeFromLoadRequest());
      dispatch(
        statusUpdateActions.updateStatus({
          status: response.status,
          statusText: response.statusText,
          rateLimitRemaining: serverRateLimitRemaining,
        })
      );
      return response;
    },
    (error) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error
      );
      dispatch(
        statusUpdateActions.updateStatus({
          status: error.response.status ? error.response.status : 500,
          statusText: error.response.statusText
            ? error.response.statusText
            : error.message,
        })
      );
      return Promise.reject(error);
    }
  );

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

  // Register error if allQuestions DB not accessible.
  useEffect(() => {
    if (
      allQuestions &&
      questionMetadata.identifier.includes("errorGettingDataFromDatabase")
    ) {
      setNoDBErrors({
        status: false,
        message: allQuestions.errorGettingDataFromDatabase.question,
      });
    }
  }, [allQuestions]);

  // If user status changes take action.
  useEffect(() => {
    if (
      user &&
      (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
    ) {
      console.log(
        "%cUser: ",
        "color:#fff;background:#ccd62d;padding:5px;border-radius:0 25px 25px 0",
        user
      );
    }
    if (user === "not logged in") {
      runGatherQuestionData({ user: false, setLocalError, setUser });
    } else if (user) {
      dispatch(authActions.logIn(user));
      runGatherQuestionData({ user, setLocalError, setUser });
    }
  }, [user, dispatch]);

  useEffect(() => {
    setUser(userLoggedIn);
  }, [userLoggedIn]);
  useEffect(() => {
    if (!noDBErrors.status)
      dispatch(
        statusUpdateActions.updateStatus({
          status: 500,
          statusText: noDBErrors.message,
        })
      );
  }, [noDBErrors.status]);

  ////////////////////////////////////////
  /// Output
  ////////////////////////////////////////

  return (
    <div className="App">
      <ErrorBoundary>
        <header className="App-header">
          <CardPrimarySquareTop>
            {" "}
            {questionMetadata && <Header />}
          </CardPrimarySquareTop>
        </header>
      </ErrorBoundary>
      <ErrorBoundary>
        <Routes>
          <Fragment>
            {" "}
            {!allQuestions && <Route path="/*" element={<BarLoader />} />}
            {allQuestions && (
              <Fragment>
                <Route
                  path="/list-of-all-questions"
                  element={
                    <AllQuestions
                      noDBErrors={noDBErrors}
                      setNoDBErrors={setNoDBErrors}
                    />
                  }
                />
                <Route
                  path="/study-topics-tool/*"
                  element={
                    <StudyTopicsTool
                      noDBErrors={noDBErrors}
                      setNoDBErrors={setNoDBErrors}
                    />
                  }
                />
                <Route
                  path="/study-topics-tool"
                  element={
                    <StudyTopicsTool
                      noDBErrors={noDBErrors}
                      setNoDBErrors={setNoDBErrors}
                    />
                  }
                />{" "}
                <Route
                  path="/study-notes-page/*"
                  element={
                    <StudyNotesPage
                      noDBErrors={noDBErrors}
                      setNoDBErrors={setNoDBErrors}
                    />
                  }
                />
                <Route
                  path="/study-notes-page"
                  element={
                    <StudyNotesPage
                      noDBErrors={noDBErrors}
                      setNoDBErrors={setNoDBErrors}
                      s
                    />
                  }
                />
                <Route
                  path="/"
                  element={
                    <Home
                      noDBErrors={noDBErrors}
                      setNoDBErrors={setNoDBErrors}
                    />
                  }
                />{" "}
              </Fragment>
            )}
          </Fragment>
        </Routes>{" "}
      </ErrorBoundary>
    </div>
  );
}

export default App;
