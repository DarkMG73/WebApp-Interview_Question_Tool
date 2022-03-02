import "./App.css";
import Home from "./pages/Home/Home";
import CardPrimary from "./UI/Cards/Card-Primary/Card-Primary";
import Header from "./Components/Header/Header";
import Nav from "./Components/Nav/Nav";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import GatherQuestionData from "./hooks/GatherQuestionData";

import { questionDataActions } from "./store/questionDataSlice";

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

  const updateState = currentState;
  console.log("🔵 | App | currentState", updateState);

  return (
    <div className="App">
      <header className="App-header">
        <CardPrimary>{currentState.questionMetadata && <Header />}</CardPrimary>
      </header>
      {currentState.allQuestions && <Home />}
    </div>
  );
}

export default App;
