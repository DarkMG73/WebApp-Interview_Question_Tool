import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Answer.module.css";
import { questionDataActions } from "../../store/questionDataSlice";
import CardTransparent from "../../UI/Cards/CardTransparent/CardTransparent";
import Card from "../../UI/Cards/Card/Card";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import storage from "../../storage/storage";
import { updateUserHistory } from "../../storage/userDB";

function Answer() {
  const currentQuestionData = useSelector(
    (state) => state.questionData.currentQuestionData
  );

  const user = useSelector((state) => state.auth.user);
  const { questionHistory, currentFilters } = useSelector(
    (state) => state.questionData
  );
  const [isAnswerCorrect, seIsAnswerCorrect] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAnswerCorrect) {
      dispatch(questionDataActions.addToHistoryCorrect());
      dispatch(questionDataActions.questionHistoryStorageNeedsUpdate(true));
    }

    if (isAnswerCorrect === false) {
      dispatch(questionDataActions.addToHistoryIncorrect());
      dispatch(questionDataActions.questionHistoryStorageNeedsUpdate(true));
    }
  }, [isAnswerCorrect]);

  let correctSelected = "";
  let incorrectSelected = "";

  function answerCorrectBtnHandler() {
    seIsAnswerCorrect(true);
  }
  function answerNotCorrectBtnHandler() {
    seIsAnswerCorrect(false);
  }

  if (isAnswerCorrect) {
    correctSelected = "selected";
    incorrectSelected = "";
  }

  if (isAnswerCorrect === false) {
    correctSelected = "";
    incorrectSelected = "selected";
  }

  return (
    <CardTransparent
      styles={{
        boxShadow:
          "inset 0 8px 15px -13px rgb(0 0 0 / 30%), 0 -8px 15px -16px white",
        paddingBottom: "2em",
        margin: "4em 0 1em",
      }}
    >
      <div className={styles["outer-wrap"]}>
        <h2 className="section-title">The Answer</h2>
        <div className={styles["inner-wrap"]}>
          <form
            name="is-answer-correct"
            className={styles["answer-button-container"]}
          >
            <p className={styles.subtitle}>Did you get it right?</p>
            <PushButton
              label={false}
              colorType="secondary"
              size="large"
              InputOrButton="input"
              type="button"
              name="answer-correct"
              value="Yes"
              onClick={answerCorrectBtnHandler}
              styles={{ margin: "0 0.5em 0 0" }}
              selected={correctSelected}
            />
            <PushButton
              label={false}
              colorType="secondary"
              size="large"
              InputOrButton="input"
              type="button"
              name="answer-not-correct"
              value="No"
              onClick={answerNotCorrectBtnHandler}
              styles={{ margin: "0 0.5em 0 0" }}
              selected={incorrectSelected}
            />
          </form>
        </div>
        <div className={styles["inner-wrap"]}>
          <Card>
            <pre>
              <code className={styles.text}> {currentQuestionData.answer}</code>
            </pre>
          </Card>
        </div>
      </div>
    </CardTransparent>
  );
}

export default Answer;
