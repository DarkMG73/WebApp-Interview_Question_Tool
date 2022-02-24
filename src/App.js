import "./App.css";
import Home from "./pages/Home/Home";
import CardPrimary from "./UI/Cards/Card-Primary/Card-Primary";
import Header from "./Components/Header/Header";
import Nav from "./Components/Nav/Nav";
import { useSelector, useDispatch } from "react-redux";
import { counterActions } from "./store/questionDataSlice";
import React, { useState, useEffect } from "react";
import QuestionDataFromDB from "./hooks/QuestionDataFromDB";

function App() {
  const dispatch = useDispatch();
  const allQuestionsData = QuestionDataFromDB();
  const currentState = useSelector((state) => state.questionData);
  useEffect(() => {
    dispatch(counterActions.initState(allQuestionsData));
  }, []);
  useEffect(() => {
    const updateState = currentState;
    console.log("🔵 | App | currentState", updateState);
  }, []);

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
