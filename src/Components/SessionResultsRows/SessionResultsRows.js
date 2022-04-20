import styles from "./SessionResultsRows.module.css";
import SessionResultsRow from "../SessionResultsRow/SessionResultsRow";
import Card from "../../UI/Cards/Card/Card";

function SessionResultsRows(props) {
  const questionHistory = props.questionHistory;
  console.log(
    "%c --> %cline:5%cquestionHistory",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
    questionHistory
  );
  const questionHistoryRows = [];

  const rowEditButtonHandler = (e) => {
    console.log("Edit Clicked", e.target);
  };

  for (const k in questionHistory) {
    if (k !== "stats") {
      for (const key in questionHistory[k]) {
        // Add the row
        questionHistoryRows.push([k, key]);
      }
    }
  }

  return (
    <div className={styles["session-results-container"]}>
      {questionHistoryRows.length > 0 ? (
        questionHistoryRows.map((array) => {
          const k = array[0];
          const key = array[1];

          return (
            <SessionResultsRow
              questionHistory={questionHistory}
              keyOne={k}
              keyTwo={key}
            />
          );
        })
      ) : (
        <Card styles={{ borderRadius: "30px", padding: "3em" }}>
          <p>
            You do not have a history yet on this browser. Answer a few
            questions and they will be saved tot his browser's memory. This
            history will remain available until you decide to erase it."
          </p>
        </Card>
      )}
    </div>
  );
}

export default SessionResultsRows;
