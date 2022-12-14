import { useSelector } from "react-redux";
import styles from "./Score.module.css";
import storage from "../../hooks/storage";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

function Score(props) {
  const { questionHistory, filteredQuestionsIds } = useSelector(
    (state) => state.questionData
  );
  console.log(
    "%c --> %cline:12%cquestionHistory",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    questionHistory
  );
  const totalQuestions = filteredQuestionsIds.length;
  const { correct, incorrect, unmarked } = questionHistory;

  const correctAmount = tallyItemsInObject(correct);
  const incorrectAmount = tallyItemsInObject(incorrect);
  const unmarkedAmount = tallyItemsInObject(unmarked);
  const totalCompleted = correctAmount + incorrectAmount + unmarkedAmount;

  const resetSessionButtonHandler = (e) => {
    storage("delete");
    window.location.reload();
  };

  function tallyItemsInObject(obj) {
    let output = 0;
    for (const i in obj) {
      output++;
    }
    return output;
  }
  return (
    <div id="iq-session-results" className={styles["iq-session-results"]}>
      {props.title && <h1 className={styles["subtitle"]}>props.title</h1>}

      <div id="results-controls" className={styles["inner-wrap"]}>
        <div
          id="correct-incorrect-unmarked"
          className={styles["correct-incorrect-unmarked"]}
        >
          {props.showCorrect && (
            <p id="correct" className={styles["score-item"]}>
              {correctAmount}
              <span> Correct </span>
            </p>
          )}
          {props.showIncorrect && (
            <p id="correct" className={styles["score-item"]}>
              {incorrectAmount}
              <span> Incorrect </span>
            </p>
          )}
          {props.showUnmarked && (
            <p id="correct" className={styles["score-item"]}>
              {unmarkedAmount}
              <span> Unmarked </span>
            </p>
          )}
        </div>
        {props.showCount && (
          <div id="count" className={styles["score-item"]}>
            {totalCompleted}
            <span> questions completed of </span>
            {totalQuestions}
          </div>
        )}
        {props.showResetBtn && (
          <PushButton
            label={false}
            colorType="secondary"
            size="small"
            InputOrButton="input"
            type="button"
            name="reset-btn"
            value="Reset Question History"
            onClick={resetSessionButtonHandler}
          />
        )}
      </div>
    </div>
  );
}

export default Score;
