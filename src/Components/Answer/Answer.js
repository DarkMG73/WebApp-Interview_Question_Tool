import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Answer.module.css";
import { questionDataActions } from "../../store/questionDataSlice";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import Card from "../../UI/Cards/Card/Card";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

function Answer() {
  const answerText = useSelector(
    (state) => state.questionData.currentQuestionData.answer
  );
  const [isAnswerCorrect, seIsAnswerCorrect] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set questionHistory state
    if (isAnswerCorrect) {
      dispatch(questionDataActions.addToHistoryCorrect());
    }
    if (isAnswerCorrect === false) {
      dispatch(questionDataActions.addToHistoryIncorrect());
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
    <CardPrimary>
      <div className={styles["outer-wrap"]}>
        <h2 class="section-title">The Answer</h2>
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
              <code className={styles.text}> {answerText}</code>
            </pre>
          </Card>
        </div>
      </div>
    </CardPrimary>
  );
}

export default Answer;
