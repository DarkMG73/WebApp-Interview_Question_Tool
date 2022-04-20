import { useSelector } from "react-redux";
import styles from "./OutputControls.module.css";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { hyphenate } from "../../hooks/utility";
import useExportData from "../../hooks/useExportData";

function OutputControls(props) {
  const currentQuestionData = useSelector((state) => state.questionData);
  const exportData = useExportData({ type: "" });

  function exportCVSButtonHandler() {
    console.log("clicked");
    exportData({ type: "cvs" });
  }
  function exportJSONButtonHandler() {
    console.log("clicked");
    exportData({ type: "json" });
  }

  return (
    <div id="output-controls" className={styles.outerwrap}>
      <h2 class="section-title">OutputControls</h2>
      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
        <PushButton
          inputOrButton="button"
          id="export-cvs-btn"
          colorType="secondary"
          value="session-record"
          data-value="export-cvs"
          size="medium"
          onClick={exportCVSButtonHandler}
        >
          Export CVS
        </PushButton>
        <PushButton
          inputOrButton="button"
          id="export-json-btn"
          colorType="secondary"
          value="session-record"
          data-value="export-json"
          size="medium"
          onClick={exportJSONButtonHandler}
        >
          Export JSON
        </PushButton>

        <PushButton
          inputOrButton="button"
          id="all-quest-link"
          colorType="secondary"
          value="session-record"
          href="https://www.glassinteractive.com/interview-questions-list/"
          data-value="link-all-quests-page"
          size="medium"
          onClick={exportCVSButtonHandler}
        >
          All Questions List
        </PushButton>
      </div>
    </div>
  );
}

export default OutputControls;
