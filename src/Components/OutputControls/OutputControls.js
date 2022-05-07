import styles from "./OutputControls.module.css";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData from "../../hooks/useExportData";

function OutputControls(props) {
  let navigate = useNavigate();
  const exportData = useExportData({ type: "" });

  function exportCVSButtonHandler() {
    exportData({ type: "cvs" });
  }
  function exportJSONButtonHandler() {
    exportData({ type: "json" });
  }
  function listOfAllQuestionsButtonHandler() {
    navigate("../list-of-all-questions", { replace: false });
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

        {!props.hideAllQuestionsListButton && (
          <PushButton
            inputOrButton="button"
            id="all-quest-link"
            colorType="secondary"
            value="session-record"
            href="./list-of-all-questions"
            data-value="link-all-quests-page"
            size="medium"
            onClick={listOfAllQuestionsButtonHandler}
          >
            All Questions List
          </PushButton>
        )}
      </div>
    </div>
  );
}

export default OutputControls;
