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
import AllQuestions from "./Components/AllQuestions/AllQuestions";

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

  return (
    <div className="App">
      <header className="App-header">
        <CardPrimarySquareTop>
          {currentState.questionMetadata && <Header />}
        </CardPrimarySquareTop>
      </header>
      <Routes>
        {currentState.allQuestions && <Route path="/" element={<Home />} />}
        <Route path="/list-of-all-questions" element={<AllQuestions />} />)
      </Routes>
    </div>
  );
}

export default App;
