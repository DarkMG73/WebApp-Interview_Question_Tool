import styles from "./StudyTopicsTool.module.css";
import { statusUpdateActions } from "../../store/statusUpdateSlice";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";
import axios from "axios";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import OutputControls from "../../Components/OutputControls/OutputControls";
import Footer from "../../Components/Footer/Footer";
import BottomBar from "../../Components/BottomBar/BottomBar";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";

function StudyTopicsTool() {
  const { allQuestions, questionMetadata, studyNotes } = useSelector(
    (state) => state.questionData
  );
  const user = useSelector((state) => state.auth.user);
  const [noDBErrors, setNoDBErrors] = useState(true);
  const [dBErrorMessage, setDbErrorMessage] = useState(false);
  const params = new URLSearchParams(window.location.pathname);
  const location = useLocation();
  let targetIDToScrollTo = location.state;
  let navigate = useNavigate();
  const dispatch = useDispatch();
  // AXIOS REQ & RES FOR STATUS UPDATES
  axios.interceptors.request.use(
    (request) => {
      dispatch(loadingRequestsActions.addToLoadRequest());
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      const serverRateLimitRemaining = response.headers["ratelimit-remaining"];
      dispatch(loadingRequestsActions.removeFromLoadRequest());
      dispatch(
        statusUpdateActions.updateStatus({
          status: response.status,
          statusText: response.statusText,
          rateLimitRemaining: serverRateLimitRemaining,
        })
      );
      return response;
    },
    (error) => {
      const serializedError = new Set();
      // console.log("HOME---ERROR", error.response);

      dispatch(
        statusUpdateActions.updateStatus({
          status: error.response.status,
          statusText: error.response.statusText,
        })
      );
      return Promise.reject(error);
    }
  );
  //////////////////////////////////

  if (targetIDToScrollTo && targetIDToScrollTo.hasOwnProperty("_id"))
    targetIDToScrollTo = targetIDToScrollTo._id;
  const scrollToElm = useRef();

  useEffect(() => {
    if (questionMetadata.identifier.includes("errorGettingDataFromDatabase")) {
      setNoDBErrors(false);
      setDbErrorMessage(allQuestions.errorGettingDataFromDatabase.question);
    }
  }, [allQuestions]);

  const allQuestionsSet = { questions: {} };
  const groupSize = 10000;
  let count = 0;
  for (const id of studyNotes.studyTopicsIDs) {
    allQuestionsSet.questions[id] = { ...allQuestions[id] };
    count++;
    if (count >= groupSize) break;
  }
  const returnHomeButtonHandler = () => {
    navigate("../", { replace: false });
  };

  useEffect(() => {
    if (scrollToElm.current)
      scrollToElm.current.scrollIntoView({ behavior: "smooth" });
  }, [scrollToElm.current]);

  return (
    <div>
      <CardSecondary>
        <div id="all-questions-page" className={styles.outerwrap}>
          {!noDBErrors && (
            <CardSecondary>
              <p className={styles["db-error-message"]}>{dBErrorMessage}</p>
            </CardSecondary>
          )}
          {!studyNotes ||
            (studyNotes.studyTopicsIDs.length <= 0 && (
              <Fragment>
                <br />
                <h2 className="section-title">
                  There are no Study Topics for this user.{" "}
                </h2>
                <p>
                  Either login with another account or return to the interview
                  tool to add Study Topics for this user.
                </p>
              </Fragment>
            ))}
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

          {studyNotes && studyNotes.studyTopicsIDs.length > 0 && noDBErrors && (
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
                open={targetIDToScrollTo}
              >
                <div id="study-question-rows">
                  <SessionResultsRows
                    questionHistory={allQuestionsSet}
                    hideSectionTitles={true}
                    showLoader={true}
                    refToPass={scrollToElm}
                    scrollToID={targetIDToScrollTo}
                  />
                </div>
              </CollapsibleElm>
            </Fragment>
          )}
        </div>
        <Fragment>
          <OutputControls
            hideExportIncorrectToCSVButton={true}
            hideExportSessionHistoryToJSONButton={true}
            hideAllQuestionsListButton={true}
            showExportStudyTopicsToCSV={true}
          />
        </Fragment>
      </CardSecondary>
      <CardSecondary>
        <Footer />
      </CardSecondary>
      <BottomBar />
    </div>
  );
}

export default StudyTopicsTool;
