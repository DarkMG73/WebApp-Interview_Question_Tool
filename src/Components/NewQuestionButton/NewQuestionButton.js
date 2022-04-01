import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { questionDataActions } from "../../store/questionDataSlice";
import { timerActions } from "../../store/timerSlice";
import styles from "./NewQuestionButton.module.css";
import { numberToText } from "../../hooks/utility";
import storage from "../../hooks/storage";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

function NewQuestionButton(props) {
  const [questionComplete, setQuestionComplete] = useState(false);
  const questionData = useSelector((state) => state.questionData);
  const timerRunning = useSelector((state) => state.timer.timerRunning);
  const dispatch = useDispatch();
  const { questionHistory, currentQuestionData } = useSelector(
    (state) => state.questionData
  );

  useEffect(() => {
    if (questionComplete) {
      dispatch(questionDataActions.addToHistoryUnmarked());
      setQuestionComplete(false);
    }
  }, [questionComplete, setQuestionComplete]);

  useEffect(() => {
    storage("add", questionHistory);
  }, [questionHistory]);

  function newQuestionBtnHandler() {
    dispatch(timerActions.clearTimer());
    dispatch(timerActions.startTimer());
    dispatch(timerActions.initiateQuiz());

    dispatch(questionDataActions.generateNewQuestion());
  }

  function finishQuestionBtnHandler() {
    dispatch(timerActions.stopTimer());
    setQuestionComplete(true);
  }

  return (
    <Fragment>
      {!timerRunning && (
        <PushButton
          inputOrButton="button"
          id="new-question-button"
          colorType="secondary"
          dataValue="New Question"
          data=""
          size="heading"
          onClick={newQuestionBtnHandler}
        >
          <h1 className="iq-header">New Question</h1>
        </PushButton>
      )}
      {timerRunning && (
        <PushButton
          inputOrButton="button"
          id="finish-question-button"
          colorType="primary"
          dataValue="New Question"
          data=""
          size="heading"
          onClick={finishQuestionBtnHandler}
        >
          <h1 className="iq-header">Click When Finished</h1>
        </PushButton>
      )}
    </Fragment>
  );
}

export default NewQuestionButton;
