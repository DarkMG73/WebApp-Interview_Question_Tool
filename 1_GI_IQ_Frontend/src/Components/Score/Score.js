import { useSelector, useDispatch } from "react-redux";
import styles from "./Score.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { questionDataActions } from "../../store/questionDataSlice";

function Score(props) {
  const { questionHistory, filteredQuestionsIds } = useSelector(
    (state) => state.questionData
  );
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const totalQuestions = filteredQuestionsIds.length;
  const {
    correct,
    incorrect,
    unmarked,
    stats,
    ...otherQuestionHistory
  } = questionHistory;

  const correctAmount = tallyItemsInObject(correct);
  const incorrectAmount = tallyItemsInObject(incorrect);
  const unmarkedAmount = tallyItemsInObject(unmarked);
  const totalCompleted = correctAmount + incorrectAmount + unmarkedAmount;

  const resetSessionButtonHandler = (e) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete your question history? If you click "OK" below, your session history will be deleted and an entry will be created in the Session History Backup list with todays date and an * added. You can use this to restore your progress to where it was before the reset.\n\nClick "OK" to reset the session history or "Cancel" to return without resetting.'
    );
    const defaultUserHistory = {
      correct: {},
      stats: { usedIds: [] },
      incorrect: {},
      unmarked: {},
      ...otherQuestionHistory,
    };
    if (shouldDelete) {
      dispatch(questionDataActions.updateQuestionHistory(defaultUserHistory));
      dispatch(questionDataActions.questionHistoryStorageNeedsUpdate(true));
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
    <div
      key="iq-session-results"
      id="iq-session-results"
      className={styles["iq-session-results"]}
    >
      {props.title && <h1 className={styles["subtitle"]}>props.title</h1>}

      <div
        key="results-controls"
        id="results-controls"
        className={styles["inner-wrap"]}
      >
        <div
          key="correct-incorrect-unmarked"
          id="correct-incorrect-unmarked"
          className={styles["correct-incorrect-unmarked"]}
        >
          {props.showCorrect && (
            <p
              key="correctAmount"
              id="correct"
              className={styles["score-item"]}
            >
              {correctAmount}
              <span> Correct </span>
            </p>
          )}
          {props.showIncorrect && (
            <p key="Incorrect" id="correct" className={styles["score-item"]}>
              {incorrectAmount}
              <span> Incorrect </span>
            </p>
          )}
          {props.showUnmarked && (
            <p
              key="unmarkedAmount"
              id="correct"
              className={styles["score-item"]}
            >
              {unmarkedAmount}
              <span> Unmarked </span>
            </p>
          )}
        </div>
        {props.showCount && (
          <div key="count" id="count" className={styles["score-item"]}>
            {totalCompleted}
            <span> questions completed of </span>
            {totalQuestions}
          </div>
        )}
        {props.showResetBtn && (
          <div
            key="reset-history-button-wrap"
            className={styles["reset-history-button-wrap"]}
          >
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Score;
