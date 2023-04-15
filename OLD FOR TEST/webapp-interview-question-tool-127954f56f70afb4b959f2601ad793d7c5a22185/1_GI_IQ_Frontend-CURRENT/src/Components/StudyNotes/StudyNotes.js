import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "./StudyNotes.module.css";
import { questionDataActions } from "../../store/questionDataSlice";
import { updateStudyNotes } from "../../storage/userDB";
import storage from "../../storage/storage";
import useStudyTopicIdAddToStorage from "../../Hooks/useStudyTopicIdAddToStorage";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

const StudyNotes = () => {
  const dispatch = useDispatch();
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.questionData
  );
  const user = useSelector((state) => state.auth.user);
  console.log(
    "%c --> %cline:12%cstudyNotes",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
    studyNotes
  );
  const studyTopicAddToStorage = useStudyTopicIdAddToStorage();
  const allQuestions = useSelector((state) => state.questionData.allQuestions);
  const studyTopicIdentifierElm = useRef();
  const studyNotesElm = useRef();
  const [questionsIDsToOutput, setQuestionsIDsToOutput] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [currentStudyNotesText, setCurrentStudyNotesText] = useState(
    studyNotes.studyNotes
  );
  const [studyNoteElmHeight, setStudyNoteElmHeight] = useState("30em");
  const navigate = useNavigate();

  const studyTopicIDSubmitHandler = (e) => {
    e.preventDefault();

    let questionIdentifier = Object.keys(allQuestions).filter(
      (questionID) =>
        allQuestions[questionID]._id == studyTopicIdentifierElm.current.value
    );
    questionIdentifier = questionIdentifier.toString();

    if (questionIdentifier.length <= 0) {
      setInputError(
        "That question ID does not appear in the master list. Please make sure to copy and paste the full ID."
      );
    } else {
      const IdAddedToStorage = studyTopicAddToStorage({ questionIdentifier });
      console.log(
        "%c --> %cline:51%cIdAddedToStorage",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
        IdAddedToStorage
      );
      if (!IdAddedToStorage.status) setInputError(IdAddedToStorage.message);
    }
  };

  const clearListButtonHandler = (e) => {
    const confirm = window.confirm(
      "Are you sure you want to delete all study topics? This can not be undone."
    );
    if (confirm) {
      const newStudyNotes = { ...studyNotes };
      newStudyNotes.studyTopicsIDs = [];
      dispatch(questionDataActions.clearStudyTopicsIDs());
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user)
        storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
    }
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

  function studyTopicsPageButtonHandler(e) {
    const targetID = e.target.value;
    if (targetID === "-FULL-PAGE-") {
      navigate(`../study-topics-tool`);
    } else {
      navigate(`../study-topics-tool/${targetID}`, {
        state: { _id: targetID },
      });
    }
  }

  function studyNotesPageButtonHandler() {
    navigate(`../study-notes-page`);
  }

  function studyTopicDeleteButtonHandler(e) {
    const targetID = e.target.value;
    const newStudyNotes = { ...studyNotes };
    newStudyNotes.studyTopicsIDs = newStudyNotes.studyTopicsIDs.filter(
      (id) => id != targetID
    );
    const confirm = window.confirm(
      "Are you sure you want to remove this item from your study topics list?"
    );
    if (confirm) {
      dispatch(questionDataActions.updateStudyNotes(newStudyNotes));
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user)
        storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
    }
  }

  useEffect(() => {
    if (inputError) alert(inputError);
    setInputError(false);
  }, [inputError]);

  useEffect(() => {
    setCurrentStudyNotesText(studyNotes.studyNotes);
  }, [studyNotes.studyNotes]);

  useEffect(() => {
    // Use to start at full height.
    studyNotesElm.current.style.height = "1px";
    studyNotesElm.current.style.height =
      25 + studyNotesElm.current.scrollHeight + "px";
  }, [studyNotesElm.current]);

  function textAreaAdjust() {
    studyNotesElm.current.style.height = "1px";
    studyNotesElm.current.style.height =
      25 + studyNotesElm.current.scrollHeight + "px";
    // setStudyNoteElmHeight(25 + studyNotesElm.current.scrollHeight);
  }

  return (
    <div className={styles["study-notes-container"]}>
      <h2 className={"section-title " + styles["title"]}>Study Plan & Notes</h2>
      <div className={styles["study-topics-container"]}>
        <form className={styles["form"]} onSubmit={studyTopicIDSubmitHandler}>
          <h3 className={styles["title"]}>Question Topics to Study</h3>
          <div className={styles["list-full-launch"]}>
            <PushButton
              inputOrButton="button"
              id="study-topics-launch"
              colorType="primary"
              value="-FULL-PAGE-"
              href="./study-topics-tool"
              size="small"
              onClick={studyTopicsPageButtonHandler}
            >
              Launch Study Topics
              <span className={styles["right-arrow"]}>&#x2192;</span>
            </PushButton>
            <Link
              to="/study-topics-tool/"
              target="_blank"
              state={{ user: user }}
            >
              Pop Out Study Topics
              <span className={styles["up-arrow"]}>&#x2192;</span>
            </Link>
          </div>
          <p>
            If further study is needed on a specific question, copy and paste
            the question ID below and click the button to add it to the list.
            The question ID can be found on the right side of each question in
            the Session Results area.
          </p>
          <div className={styles["study-topics-input-container"]}>
            <input
              key={Math.random()}
              name="Question ID"
              ref={studyTopicIdentifierElm}
              placeholder="Paste a question ID here..."
            />
            <PushButton
              inputOrButton="input"
              type="submit"
              id="study-topic-add-button"
              colorType="primary"
              value="Add the Question ID"
              size="medium"
              styles={{ margin: "0" }}
            />
          </div>
        </form>
        {studyNotes &&
          studyNotes.hasOwnProperty("studyTopicsIDs") &&
          studyNotes.studyTopicsIDs &&
          studyNotes.studyTopicsIDs.length > 0 && (
            <div className={styles["study-list-container"]}>
              <ul className={styles["study-list"]}>
                {studyNotes.studyTopicsIDs.map((identifier) => {
                  let output;
                  if (allQuestions.hasOwnProperty(identifier))
                    output = (
                      <li className={styles["study-list-item"]}>
                        <div className={styles["list-item-launch"]} href="">
                          <PushButton
                            inputOrButton="button"
                            id="study-topics-tool-link"
                            colorType="primary"
                            value={identifier}
                            href="./study-topics-tool"
                            size="small"
                            onClick={studyTopicsPageButtonHandler}
                          >
                            Open Topic{" "}
                            <span className={styles["right-arrow"]}>
                              &#x2192;
                            </span>
                          </PushButton>
                        </div>
                        <div
                          className={
                            styles["study-list-item-inner-wrap"] +
                            " " +
                            styles["study-list-item-topic-title"]
                          }
                        >
                          <h4>{allQuestions[identifier].title}</h4>
                        </div>
                        <div
                          className={
                            styles["study-list-item-inner-wrap"] +
                            " " +
                            styles["study-list-item-support"]
                          }
                        >
                          <p>{allQuestions[identifier].topic}</p>

                          <div
                            className={
                              styles["topic-button-wrap"] +
                              " " +
                              styles["button-wrap"]
                            }
                            href=""
                          >
                            <div className={styles["list-item-delete"]}>
                              <PushButton
                                inputOrButton="button"
                                id="study-topic-delete-button"
                                colorType="secondary"
                                value={identifier}
                                size="small"
                                onClick={studyTopicDeleteButtonHandler}
                              >
                                X
                              </PushButton>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  return output;
                })}
              </ul>
              <div className={styles["list-item-clear-list"]}>
                <PushButton
                  inputOrButton="button"
                  id="study-topic-delete-button"
                  colorType="secondary"
                  value=" Clear Study Topics List"
                  size="small"
                  onClick={clearListButtonHandler}
                >
                  Clear Study List
                </PushButton>
              </div>
            </div>
          )}
      </div>
      <div className={styles["study-notpad-container"]}>
        <form
          className={styles["form"]}
          onSubmit={studyNotesSubmitHandler}
          onChange={studyNotesOnChangeHandler}
        >
          <h3 className={styles["title"]}>Note Pad</h3>
          <div className={styles["list-full-launch"]}>
            <PushButton
              inputOrButton="button"
              id="notpad-launch-full-page"
              colorType="primary"
              value="Open Note Pad"
              size="small"
              onClick={studyNotesPageButtonHandler}
            >
              Open Note Pad
              <span className={styles["right-arrow"]}>&#x2192;</span>
            </PushButton>
            <Link
              to="/study-notes-page/"
              target="_blank"
              state={{ user: user }}
            >
              Pop Out Note Pad
              <span className={styles["up-arrow"]}>&#x2192;</span>
            </Link>
          </div>
          <p>
            Jot down quick thoughts on a question or subject, or even outline
            ideas for a new study approach, projects ideas, etc. Anything that
            that helps the learning process.
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
    </div>
  );
};

export default StudyNotes;
