import styles from "./OptionsPanel.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

function OptionsPanel() {
  function peakAtAnswerBtnHandler(e) {
    console.log(e.target, " button clicked");
  }
  function aboutQuestionBtnHandler(e) {
    console.log(e.target, " button clicked");
  }
  function newSessionRecordBtnHandler(e) {
    console.log(e.target, " button clicked");
  }

  return (
    <div id="options-panel" className={styles["inner-wrap"]}>
      <PushButton
        inputOrButton="button"
        id="answer"
        colorType="secondary"
        value="answer"
        data=""
        size="small"
        onClick={peakAtAnswerBtnHandler}
      >
        Peek at the Answer
      </PushButton>
      <PushButton
        inputOrButton="button"
        id="learn-question"
        colorType="secondary"
        value="learn-question"
        data=""
        size="small"
        onClick={aboutQuestionBtnHandler}
      >
        About this Question
      </PushButton>
      <PushButton
        inputOrButton="button"
        id="session-record-btn"
        colorType="secondary"
        value="session-record"
        data=""
        size="small"
        onClick={newSessionRecordBtnHandler}
      >
        View Session Record
      </PushButton>
    </div>
  );
}

export default OptionsPanel;
