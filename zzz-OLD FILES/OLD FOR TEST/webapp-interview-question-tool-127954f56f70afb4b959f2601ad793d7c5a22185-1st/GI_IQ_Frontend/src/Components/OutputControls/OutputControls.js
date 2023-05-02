import styles from "./OutputControls.module.css";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData from "../../hooks/useExportData";

function OutputControls(props) {
  let navigate = useNavigate();
  const exportData = useExportData({ type: "" });

  function exportCSVButtonHandler() {
    exportData({ type: "cvs" });
  }
  function exportStudyTopicsCSVButtonHandler() {
    exportData({ type: "cvs", exportStudyTopics: true });
  }
  function exportJSONButtonHandler() {
    exportData({ type: "json" });
  }
  function exportAllToJSONButtonHandler() {
    exportData({ type: "json", exportAll: true });
  }
  function exportAllToJSONButtonHandler() {
    exportData({ type: "json", exportAll: true });
  }
  function listOfAllQuestionsButtonHandler() {
    navigate("../list-of-all-questions", { replace: false });
  }

  return (
    <div id="output-controls" className={styles.outerwrap}>
      <h2 className="section-title">OutputControls</h2>
      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
        {!props.hideExportIncorrectToCSVButton && (
          <PushButton
            inputOrButton="button"
            id="export-cvs-btn"
            colorType="secondary"
            value="export-cvs"
            data-value="export-cvs"
            size="medium"
            onClick={exportCSVButtonHandler}
          >
            Export Incorrect Questions to Cvs
          </PushButton>
        )}
        {props.showExportStudyTopicsToCSV && (
          <PushButton
            inputOrButton="button"
            id="export-cvs-btn"
            colorType="secondary"
            value="export-cvs"
            data-value="export-cvs"
            size="medium"
            onClick={exportStudyTopicsCSVButtonHandler}
          >
            Export Study Topics Questions to CSV
          </PushButton>
        )}

        {!props.hideExportSessionHistoryToJSONButton && (
          <PushButton
            inputOrButton="button"
            id="export-json-btn"
            colorType="secondary"
            value="export-json"
            data-value="export-json"
            size="medium"
            onClick={exportJSONButtonHandler}
          >
            Export Session History to JSON
          </PushButton>
        )}

        {!props.hideAllQuestionsListButton && (
          <PushButton
            inputOrButton="button"
            id="all-quest-link"
            colorType="secondary"
            value="all-questions-list"
            href="./list-of-all-questions"
            data-value="link-all-quests-page"
            size="medium"
            onClick={listOfAllQuestionsButtonHandler}
          >
            All Questions List
          </PushButton>
        )}

        {props.showExportAllQuestions && (
          <PushButton
            inputOrButton="button"
            id="all-quest-link"
            colorType="secondary"
            value="export-all-questions-json"
            href="./list-of-all-questions"
            data-value="link-all-quests-page"
            size="medium"
            onClick={exportAllToJSONButtonHandler}
          >
            Export All Questions to JSON
          </PushButton>
        )}
      </div>
    </div>
  );
}

export default OutputControls;
