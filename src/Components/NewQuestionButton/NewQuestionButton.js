import { useSelector, useDispatch } from "react-redux";
import styles from "./NewQuestionButton.module.css";
import { numberToText } from "../../hooks/utility";

function NewQuestionButton(props) {
  const questionData = useSelector((state) => state.questionData);
  const dispatch = useDispatch();

  console.log(
    "🔵 | NewQuestionButton | currentQuestionData",
    questionData.currentQuestionData
  );

  function newQuestionBtnHandler() {
    dispatch({ type: "generateNewQuestion" });
    console.log(
      "🔵 | NewQuestionButton | currentQuestionData",
      questionData.currentQuestionData
    );
  }
  return (
    <button
      id="new-question-button"
      className={styles.outerwrap}
      onClick={newQuestionBtnHandler}
    >
      <h1 className="iq-header">New Question</h1>
    </button>
  );
}

export default NewQuestionButton;
