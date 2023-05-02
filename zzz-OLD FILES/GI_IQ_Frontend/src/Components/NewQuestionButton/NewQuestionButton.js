import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { questionDataActions } from "../../store/questionDataSlice";
import { authActions } from "../../store/authSlice";
import { timerActions } from "../../store/timerSlice";
import styles from "./NewQuestionButton.module.css";
import storage from "../../storage/storage";
import { updateUserHistory } from "../../storage/userDB";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

function NewQuestionButton(props) {
  const [questionComplete, setQuestionComplete] = useState(false);
  const { questionHistory, currentFilters, ...otherQuestionData } = useSelector(
    (state) => state.questionData
  );
  const { user, recentLogout } = useSelector((state) => state.auth);
  const timerRunning = useSelector((state) => state.timer.timerRunning);
  const dispatch = useDispatch();

  useEffect(() => {
    if (questionComplete) {
      dispatch(questionDataActions.addToHistoryUnmarked());
      setQuestionComplete(false);
    }
  }, [questionComplete, setQuestionComplete]);

  useEffect(() => {
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
      alert("IN COPY");
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
    }
    // else {
    //   console.log(
    //     "%c --> %cline:63%celse",
    //     "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //     "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //     "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px"
    //   );
    //   storage("ADD", { questionHistory, currentFilters, ...otherQuestionData });
    // }
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
          colorType="primary"
          dataValue="New Question"
          data=""
          size="heading"
          onClick={newQuestionBtnHandler}
          styles={{
            boxShadow:
              "inset 4px 4px 14px -7px rgb(255 255 255),  inset -4px -4px 14px -7px rgb(0 0 0 / 50%)",
          }}
        >
          <h1 className="iq-header">Grab a New Question</h1>
        </PushButton>
      )}
      {timerRunning && (
        <PushButton
          inputOrButton="button"
          id="finish-question-button"
          colorType="secondary"
          dataValue="New Question"
          data=""
          size="heading"
          onClick={finishQuestionBtnHandler}
          styles={{
            boxShadow:
              "inset 4px 4px 14px -7px rgb(255 255 255),  inset -4px -4px 14px -7px rgb(0 0 0 / 50%)",
          }}
        >
          <h1 className="iq-header">Click When Finished</h1>
        </PushButton>
      )}
    </Fragment>
  );
}

export default NewQuestionButton;
