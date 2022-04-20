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

  function answerCorrectBtnHandler() {
    seIsAnswerCorrect(true);
  }
  function answerNotCorrectBtnHandler() {
    seIsAnswerCorrect(false);
  }
  return (
    <CardPrimary>
      <div className={styles["outer-wrap"]}>
        <h2 class="section-title">The Answer</h2>
        <div className={styles["inner-wrap"]}>
          <Card>
            <p className={styles.text}>{answerText}</p>
          </Card>
        </div>
        <div className={styles["inner-wrap"]}>
          <form name="is-answer-correct">
            <h3 className={styles.subtitle}>Did you get it right?</h3>
            <PushButton
              label={false}
              colorType="secondary"
              size="large"
              InputOrButton="input"
              type="button"
              name="answer-correct"
              value="Yes"
              onClick={answerCorrectBtnHandler}
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
            />
          </form>
        </div>
      </div>
    </CardPrimary>
  );
}

export default Answer;
