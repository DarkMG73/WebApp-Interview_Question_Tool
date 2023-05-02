import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SessionResultsRows.module.css";
import SessionResultsRow from "../SessionResultsRow/SessionResultsRow";
import Card from "../../UI/Cards/Card/Card";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";

function SessionResultsRows(props) {
  const questionHistory = props.questionHistory;
  const dispatch = useDispatch();
  const questionHistoryCategories = [];
  const refToPass = props.refToPass;
  const scrollToID = props.scrollToID;
  const questionHistoryRows = {};
  let questionHistoryCount = 0;
  const displayedCategories = ["correct", "incorrect", "unmarked", "questions"];

  for (const k in questionHistory) {
    if (displayedCategories.includes(k)) {
      questionHistoryCategories.push(k);
      questionHistoryRows[k] = [];
      for (const key in questionHistory[k]) {
        // Add the row
        questionHistoryRows[k].push(key);
        questionHistoryCount++;
      }
    }
  }

  const elementOutput = questionHistoryCategories.map((cat, i) => {
    if (questionHistoryRows[cat].length > 0) {
      const output = (
        <div
          key={"session-results-" + i}
          className={styles[cat] + " " + styles["section-wrap"]}
        >
          {!props.hideSectionTitles && (
            <h3 className={styles["history-section-title"]}>{cat}</h3>
          )}
          {questionHistoryRows[cat].map((key) => {
            if (key === scrollToID) {
              return (
                <Fragment>
                  <a ref={refToPass}></a>
                  <SessionResultsRow
                    key={"session-results-row" + cat + key + i}
                    questionHistory={questionHistory}
                    keyOne={cat}
                    keyTwo={key}
                    open={true}
                  />
                </Fragment>
              );
            } else {
              return (
                <SessionResultsRow
                  key={"session-results-row" + cat + key + i}
                  questionHistory={questionHistory}
                  keyOne={cat}
                  keyTwo={key}
                />
              );
            }
          })}
        </div>
      );

      return output;
    }
  });
  // dispatch(loadingRequestsActions.removeFromLoadRequest());

  return (
    <div
      key="session-results-container"
      className={styles["session-results-container"]}
    >
      {questionHistoryCount > 0 ? (
        elementOutput.map((row) => row)
      ) : (
        <Card styles={{ borderRadius: "30px", padding: "3em" }}>
          {!props.showLoader && (
            <p>
              You do not have a history yet on this browser. Answer a few
              questions and they will be saved tot his browser's memory. This
              history will remain available until you decide to erase it."
            </p>
          )}
          {props.showLoader && (
            <div className={styles["loader-wrap"]}>
              <BarLoader />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default SessionResultsRows;
