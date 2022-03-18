import styles from "./OptionsPanel.module.css";

function OptionsPanel() {
  return (
    <div id="options-panel" className={styles["inner-wrap"]}>
      <button
        id="answer"
        className="button wide-btn"
        data-value="answer"
        data-data=""
      >
        Peek at the Answer
      </button>
      <button
        id="learn-question"
        className="button wide-btn"
        data-value="learn-question"
        data-data=""
      >
        About this Question
      </button>
      <button
        id="session-record-btn"
        className="button wide-btn"
        data-value="session-record"
        data-data=""
      >
        View Session Record
      </button>
    </div>
  );
}

export default OptionsPanel;
