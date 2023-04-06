import styles from "./StudyTopicsTool.module.css";
import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import OutputControls from "../../Components/OutputControls/OutputControls";
import Footer from "../../Components/Footer/Footer";
import BottomBar from "../../Components/BottomBar/BottomBar";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";

function AllQuestions() {
  const { allQuestions, questionMetadata, studyNotes } = useSelector(
    (state) => state.questionData
  );
  const user = useSelector((state) => state.auth.user);
  const [noDBErrors, setNoDBErrors] = useState(true);
  const [dBErrorMessage, setDbErrorMessage] = useState(false);

  useEffect(() => {
    if (questionMetadata.identifier.includes("errorGettingDataFromDatabase")) {
      setNoDBErrors(false);
      setDbErrorMessage(allQuestions.errorGettingDataFromDatabase.question);
    }
  }, [allQuestions]);

  let navigate = useNavigate();

  const allQuestionsSet = { questions: {} };
  const groupSize = 10000;
  let count = 0;
  for (const id of studyNotes.studyTopicsIDs) {
    console.log(
      "%c --> %cline:31%cID",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
      id
    );
    allQuestionsSet.questions[id] = { ...allQuestions[id] };
    count++;
    if (count >= groupSize) break;
  }
  const returnHomeButtonHandler = () => {
    navigate("../", { replace: false });
  };

  return (
    <div>
      <CardSecondary>
        <div id="all-questions-page" className={styles.outerwrap}>
          {!noDBErrors && (
            <CardSecondary>
              <p className={styles["db-error-message"]}>{dBErrorMessage}</p>
            </CardSecondary>
          )}
          <PushButton
            inputOrButton="button"
            id="export-json-btn"
            colorType="primary"
            value="session-record"
            data-value="export-json"
            size="large"
            onClick={returnHomeButtonHandler}
            styles={{ top: 0, position: "sticky", zIndex: 90, minWidth: "33%" }}
          >
            &larr; Return to Interview Mode
          </PushButton>
          <LoginStatus />
          {noDBErrors && (
            <Fragment>
              <h2 className="section-title">Study Topics You Have Selected</h2>
              <CollapsibleElm
                id={"session-results-see-more-btn"}
                maxHeight="27em"
                inputOrButton="button"
                buttonStyles={{
                  margin: "0 auto",
                  letterSpacing: "0.25em",
                  fontVariant: "small-caps",
                  transform: "translateY(14%)",
                  minWidth: "5em",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                  borderRadius: "0 0 50px 50px",
                  height: "100%",
                  padding: "2em 0",
                }}
                colorType="primary"
                data=""
                size="large"
              >
                <div id="all-questions">
                  <SessionResultsRows
                    questionHistory={allQuestionsSet}
                    hideSectionTitles={true}
                    showLoader={true}
                  />
                </div>
              </CollapsibleElm>
            </Fragment>
          )}
        </div>
        {noDBErrors && (
          <Fragment>
            <OutputControls
              hideExportIncorrectToCSVButton={true}
              hideExportSessionHistoryToJSONButton={true}
              hideAllQuestionsListButton={true}
              showExportStudyTopicsToCSV={true}
            />
          </Fragment>
        )}
      </CardSecondary>{" "}
      <CardSecondary>
        <Footer />
      </CardSecondary>
      <BottomBar />
    </div>
  );
}

export default AllQuestions;
