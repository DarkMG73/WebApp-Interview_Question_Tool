import { useSelector } from "react-redux";
import styles from "./Score.module.css";
import storage from "../../storage/storage";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { updateUserHistory } from "../../storage/userDB";

function Score(props) {
  const { questionHistory, filteredQuestionsIds, currentFilters } = useSelector(
    (state) => state.questionData
  );
  const user = useSelector((state) => state.auth.user);

  const totalQuestions = filteredQuestionsIds.length;
  const { correct, incorrect, unmarked } = questionHistory;

  const correctAmount = tallyItemsInObject(correct);
  const incorrectAmount = tallyItemsInObject(incorrect);
  const unmarkedAmount = tallyItemsInObject(unmarked);
  const totalCompleted = correctAmount + incorrectAmount + unmarkedAmount;

  const resetSessionButtonHandler = (e) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your question history? If you do, this will erase your question history from your local browser storage. This will not affect the question database."
    );
    if (shouldDelete) {
      if (user) {
        const defaultUserHistory = {
          correct: {},
          stats: { usedIds: [] },
          incorrect: {},
          unmarked: {},
        };
        updateUserHistory({
          user,
          dataObj: defaultUserHistory,
          currentFiltersObj: currentFilters,
        });
      } else {
        storage("DELETE");
      }
      window.location.reload();
    }
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
