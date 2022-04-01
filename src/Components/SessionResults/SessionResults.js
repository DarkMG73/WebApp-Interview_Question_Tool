import { useSelector } from "react-redux";
import styles from "./SessionResults.module.css";
import Score from "../../Components/Score/Score";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";

function SessionResults(props) {
  const questionHistory = useSelector(
    (state) => state.questionData.questionHistory
  );

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
      <SessionResultsRows questionHistory={questionHistory} />
    </div>
  );
}

export default SessionResults;
