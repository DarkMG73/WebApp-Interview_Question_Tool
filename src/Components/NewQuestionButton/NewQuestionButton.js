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
  const { questionHistory, currentFilters } = useSelector(
    (state) => state.questionData
  );
  const timerRunning = useSelector((state) => state.timer.timerRunning);
  const dispatch = useDispatch();

  useEffect(() => {
    if (questionComplete) {
      dispatch(questionDataActions.addToHistoryUnmarked());
      setQuestionComplete(false);
    }
  }, [questionComplete, setQuestionComplete]);

  useEffect(() => {
    storage("add", { questionHistory, currentFilters });
  }, [questionHistory, currentFilters]);

  function newQuestionBtnHandler() {
    dispatch(timerActions.clearTimer());
    dispatch(timerActions.startTimer());
    dispatch(timerActions.initiateQuiz());

    dispatch(questionDataActions.generateNewQuestion());
    if (props.scrollToElm)
      props.scrollToElm.current.scrollIntoView({ behavior: "smooth" });
  }

  function finishQuestionBtnHandler() {
    dispatch(timerActions.stopTimer());
    setQuestionComplete(true);
    props.scrollToAnswer.current.scrollIntoView({ behavior: "smooth" });
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
          styles={{
            boxShadow:
              "inset 7px 7px 14px -7px rgb(255 255 255),  inset -7px -7px 14px -7px rgb(0 0 0 / 50%)",
          }}
        >
          <h1 className="iq-header">Grab a New Question</h1>
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
          styles={{
            boxShadow:
              "inset 7px 7px 14px -7px rgb(255 255 255),  inset -7px -7px 14px -7px rgb(0 0 0 / 50%)",
          }}
        >
          <h1 className="iq-header">Click When Finished</h1>
        </PushButton>
      )}
    </Fragment>
  );
}

export default NewQuestionButton;
