import styles from "./StudyNotesPage.module.css";
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
import { questionDataActions } from "../../store/questionDataSlice";
import { authActions } from "../../store/authSlice";
import { updateStudyNotes } from "../../storage/userDB";
import storage from "../../storage/storage";

function StudyNotesPage() {
  const studyNotesElm = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userFromLinkState = user } = location.state;
  console.log(
    "%c --> %cline:24%cuserFromLinkState",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
    userFromLinkState
  );
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.questionData
  );
  console.log(
    "%c --> %cline:20%cstudyNotes",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
    studyNotes
  );
  const [currentStudyNotesText, setCurrentStudyNotesText] = useState(
    studyNotes.studyNotes
  );

  const [studyNoteElmHeight, setStudyNoteElmHeight] = useState("30em");
  const user = useSelector((state) => state.auth.user);
  const [noDBErrors, setNoDBErrors] = useState(true);
  const [dBErrorMessage, setDbErrorMessage] = useState(false);
  const params = new URLSearchParams(window.location.pathname);

  let { targetIDToScrollTo } = location.state;

  const scrollToElm = useRef();
  let navigate = useNavigate();

  // If loaded outside of app, initialize state.

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

  const returnHomeButtonHandler = () => {
    navigate("../", { replace: false });
  };

  const studyNotesSubmitHandler = (e) => {
    e.preventDefault();
    const newStudyNotes = { ...studyNotes };
    newStudyNotes.studyNotes = studyNotesElm.current.value;
    dispatch(questionDataActions.updateStudyNotes(newStudyNotes));
    if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
    if (!user)
      storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
  };

  const studyNotesOnChangeHandler = (e) => {
    setCurrentStudyNotesText(studyNotesElm.current.value);
  };

  const clearNotesButtonHandler = (e) => {
    const confirm = window.confirm(
      "Are you sure you want to delete all study topics? This can not be undone."
    );
    if (confirm) {
      const newStudyNotes = { ...studyNotes };
      newStudyNotes.studyNotes = "Notes\n\n";
      dispatch(questionDataActions.updateStudyNotes(newStudyNotes));
      setCurrentStudyNotesText(newStudyNotes.studyNotes);
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user) storage("ADD", { newStudyNotes, ...otherQuestionData });
    }
  };

  useEffect(() => {
    if (userFromLinkState) dispatch(authActions.login(userFromLinkState));
  }, [userFromLinkState]);

  useEffect(() => {
    setCurrentStudyNotesText(studyNotes.studyNotes);
  }, [studyNotes.studyNotes]);

  useEffect(() => {
    textAreaAdjust();
  }, [currentStudyNotesText]);

  useEffect(() => {
    // Use to start at full height.
    if (studyNotesElm.current) {
      studyNotesElm.current.style.height = "1px";
      studyNotesElm.current.style.height =
        25 + studyNotesElm.current.scrollHeight + "px";
    }
  }, [studyNotesElm.current]);

  function textAreaAdjust() {
    studyNotesElm.current.style.height = "1px";
    studyNotesElm.current.style.height =
      25 + studyNotesElm.current.scrollHeight + "px";
    // setStudyNoteElmHeight(25 + studyNotesElm.current.scrollHeight);
  }

  return (
    <div>
      <CardSecondary>
        <div id="study-notes-page" className={styles["study-notes-page"]}>
          {!noDBErrors && (
            <CardSecondary>
              <p className={styles["db-error-message"]}>{dBErrorMessage}</p>
            </CardSecondary>
          )}
          {!studyNotes ||
            (!studyNotes.hasOwnProperty("studyNotes") && (
              <Fragment>
                <br />
                <h2 className="section-title">
                  There are no Study Notes for this user.
                </h2>
                <p>
                  Either login with another account or return to the interview
                  tool to add Study Notes for this user.
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

          {studyNotes && studyNotes.hasOwnProperty("studyNotes") && noDBErrors && (
            <div className={styles["study-notepad-container"]}>
              <form
                className={styles["form"]}
                onSubmit={studyNotesSubmitHandler}
                onChange={studyNotesOnChangeHandler}
              >
                <h3 className={styles["title"]}>Note Pad</h3>
                <p>
                  Jot down quick thoughts on a question or subject, or even
                  outline ideas for a new study approach, projects ideas, etc.
                  Anything that that helps the learning process.
                </p>
                {currentStudyNotesText == studyNotes.studyNotes && (
                  <input
                    type="submit"
                    value=""
                    className={styles["notes-are-saved-button"]}
                    disabled
                  />
                )}
                {currentStudyNotesText != studyNotes.studyNotes && (
                  <input
                    type="submit"
                    value="Save Notes"
                    className={styles["notes-not-saved-button"]}
                  />
                )}
                <div className={styles.paper}>
                  <div className={styles["paper-content"]}>
                    <textarea
                      onChange={textAreaAdjust}
                      autoFocus
                      value={currentStudyNotesText}
                      ref={studyNotesElm}
                      className={styles["note-pad-textarea"]}
                      style={{ heights: studyNoteElmHeight + "px" }}
                    />
                  </div>
                </div>
                <div className={styles["list-item-clear-list"]}>
                  <PushButton
                    inputOrButton="button"
                    id="study-topic-delete-button"
                    colorType="secondary"
                    value="Clear Study Notes"
                    size="small"
                    onClick={clearNotesButtonHandler}
                  >
                    Clear Study Notes
                  </PushButton>
                </div>
              </form>
            </div>
          )}
        </div>
        <Fragment>
          <OutputControls
            hideExportIncorrectToCSVButton={true}
            hideExportSessionHistoryToJSONButton={true}
            hideAllQuestionsListButton={true}
            showExportStudyNotePadToCSV={true}
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

export default StudyNotesPage;
