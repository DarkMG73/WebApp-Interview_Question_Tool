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
import AllQuestions from "./pages/AllQuestions/AllQuestions";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";

function App() {
  const dispatch = useDispatch();
  // const allQuestionsData = GatherQuestionData();
  const currentState = useSelector((state) => state.questionData);
  useEffect(() => {
    GatherQuestionData().then((data) => {
      console.log("🟣 | getData | questionsFromDB", data);
      dispatch(questionDataActions.initState(data));
    });
  }, []);

  // const updateState = currentState;
  console.log(
    "%c --> %cline:38%ccurrentState.allQuestions",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(20, 68, 106);padding:3px;border-radius:2px",
    currentState.allQuestions
  );
  return (
    <div className="App">
      {!currentState.allQuestions && <BarLoader />}
      <header className="App-header">
        <CardPrimarySquareTop>
          {" "}
          {currentState.questionMetadata && <Header />}
        </CardPrimarySquareTop>
      </header>

      <Routes>
        {currentState.allQuestions && (
          <Route path="/list-of-all-questions" element={<AllQuestions />} />
        )}
        {currentState.allQuestions && <Route path="/" element={<Home />} />}
      </Routes>
    </div>
  );
}

export default App;
