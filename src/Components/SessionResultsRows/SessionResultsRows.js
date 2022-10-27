import styles from "./SessionResultsRows.module.css";
import SessionResultsRow from "../SessionResultsRow/SessionResultsRow";
import Card from "../../UI/Cards/Card/Card";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";

function SessionResultsRows(props) {
  const questionHistory = props.questionHistory;
  const questionHistoryCategories = [];
  const questionHistoryRows = {};
  let questionHistoryCount = 0;

  for (const k in questionHistory) {
    if (k !== "stats") {
      questionHistoryCategories.push(k);
      questionHistoryRows[k] = [];
      for (const key in questionHistory[k]) {
        // Add the row
        questionHistoryRows[k].push(key);
        questionHistoryCount++;
      }
    }
  }

  return (
    <div
      key="session-results-container"
      className={styles["session-results-container"]}
    >
      {questionHistoryCount > 0 ? (
        questionHistoryCategories.map((cat, i) => {
          if (questionHistoryRows[cat].length > 0) {
            const output = (
              <div key={"session-results-" + i} className={styles[cat]}>
                {!props.hideSectionTitles && (
                  <h3 className={styles["history-section-title"]}>{cat}</h3>
                )}
                {questionHistoryRows[cat].map((key) => {
                  return (
                    <SessionResultsRow
                      key={"session-results-row" + cat + key + i}
                      questionHistory={questionHistory}
                      keyOne={cat}
                      keyTwo={key}
                    />
                  );
                })}
              </div>
            );
            return output;
          }
        })
      ) : (
        <Card styles={{ borderRadius: "30px", padding: "3em" }}>
          {!props.showLoader && (
            <p>
              You do not have a history yet on this browser. Answer a few
              questions and they will be saved tot his browser's memory. This
              history will remain available until you decide to erase it."
            </p>
          )}
          {props.showLoader && <BarLoader />}
        </Card>
      )}
    </div>
  );
}

export default SessionResultsRows;
