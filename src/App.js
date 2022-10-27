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
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      console.log(
        "%c Running in: ",
        "color:#fff;background:#58585b;padding:14px;border-radius:0 25px 25px 0",
        process.env.NODE_ENV
      );
    }
      GatherQuestionData().then((data) => {
        dispatch(questionDataActions.initState(data));
      });
  
  }, []);

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
        {!currentState.allQuestions && (
          <Route path="/" element={<BarLoader />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
