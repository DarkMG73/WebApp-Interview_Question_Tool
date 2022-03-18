import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { questionDataActions } from "../../store/questionDataSlice";
import Card from "../../UI/Cards/Card/Card";
// import { useSelector } from ".";

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
      console.log(
        "%c --> %cline:10%cisAnswerCorrect",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
        isAnswerCorrect
      );
    }
    if (isAnswerCorrect === false) {
      dispatch(questionDataActions.addToHistoryIncorrect());

      console.log(
        "%c --> %cline:13%cisAnswerCorrect === false",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
        isAnswerCorrect === false
      );
    }
  }, [isAnswerCorrect]);

  function answerCorrectBtnHandler() {
    console.log(
      "%c --> %cline:30%canswerCorrectBtnHandler",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
      answerCorrectBtnHandler
    );
    seIsAnswerCorrect(true);
  }
  function answerNotCorrectBtnHandler() {
    console.log(
      "%c --> %cline:34%canswerNotCorrectBtnHandler",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
      answerNotCorrectBtnHandler
    );
    seIsAnswerCorrect(false);
  }
  return (
    <Card>
      <form name="is-answer-correct">
        <h3>The Answer</h3>
        <label htmlFor="answer-correct">Yes</label>
        <input
          type="button"
          name="answer-correct"
          value="Yes"
          onClick={answerCorrectBtnHandler}
        />
        <label htmlFor="answer-not-correct">No</label>
        <input
          type="button"
          name="answer-not-correct"
          value="No"
          onClick={answerNotCorrectBtnHandler}
        />
      </form>
      <Card>
        <h3>The Answer</h3>
        <p>{answerText}</p>
      </Card>
    </Card>
  );
}

export default Answer;
