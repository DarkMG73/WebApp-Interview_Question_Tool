import { useSelector } from "react-redux";
import styles from "./SessionResults.module.css";
import { numberToText } from "../../hooks/utility";
import Score from "../../Components/Score/Score";

function SessionResults(props) {
  const questionHistory = useSelector(
    (state) => state.questionData.questionHistory
  );
  const questionHistoryRows = [];
  // console.log("🔵 | SessionResults | questionHistory", questionHistory);
  for (const k in questionHistory) {
    // console.log("🔵 | SessionResults | questionHistory", questionHistory);
    for (const key in questionHistory[k]) {
      for (const itemKey in questionHistory[k][key]) {
        const rowHTML = (
          <span className={styles[itemKey]}>
            <span>{itemKey}</span>
            <span>{questionHistory[k][key][itemKey]}</span>
          </span>
        );
        let rowWrap = (
          <li
            key={k + "-" + key + "-" + itemKey}
            id={k + "-" + key + "-" + itemKey}
          >
            {rowHTML}
          </li>
        );
        questionHistoryRows.push(rowWrap);
      }
    }
  }

  return (
    <div id="session-results" className={styles.outerwrap}>
      <h1 className="iq-header">Session Results</h1>
      <Score
        title={false}
        showResetBtn={true}
        showCorrect={true}
        showIncorrect={true}
        showUnmarked={true}
        showCount={true}
      />
      <ul className={styles["session-results-container"]}>
        {questionHistoryRows.map((item) => item)}
      </ul>
    </div>
  );
}

export default SessionResults;
