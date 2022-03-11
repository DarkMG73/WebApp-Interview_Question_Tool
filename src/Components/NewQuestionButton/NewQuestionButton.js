import { useSelector, useDispatch } from "react-redux";
import { questionDataActions } from "../../store/questionDataSlice";
import { timerActions } from "../../store/timerSlice";
import styles from "./NewQuestionButton.module.css";
import { numberToText } from "../../hooks/utility";

function NewQuestionButton(props) {
  const questionData = useSelector((state) => state.questionData);
  const timerRunning = useSelector((state) => state.timer.timerRunning);
  const dispatch = useDispatch();

  function newQuestionBtnHandler() {
    dispatch(timerActions.clearTimer());
    dispatch(timerActions.startTimer());

    console.log(
      "%c --> %cline:8%cquestionData",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
      questionData.currentQuestionData
    );

    dispatch(questionDataActions.generateNewQuestion());
  }

  function finishQuestionBtnHandler() {
    dispatch(timerActions.stopTimer());
  }

  return (
    <div>
      {!timerRunning && (
        <button
          id="new-question-button"
          className={styles.outerwrap}
          onClick={newQuestionBtnHandler}
        >
          <h1 className="iq-header">New Question</h1>
        </button>
      )}
      {timerRunning && (
        <button
          id="finish-question-button"
          className={styles.outerwrap}
          onClick={finishQuestionBtnHandler}
        >
          <h1 className="iq-header">Click When Finished</h1>
        </button>
      )}
    </div>
  );
}

export default NewQuestionButton;
