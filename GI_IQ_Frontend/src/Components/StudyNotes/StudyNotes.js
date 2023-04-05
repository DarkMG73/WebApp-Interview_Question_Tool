import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import styles from "./StudyNotes.module.css";
import { questionDataActions } from "../../store/questionDataSlice";
import { updateStudyNotes } from "../../storage/userDB";
import storage from "../../storage/storage";
const StudyNotes = () => {
  const dispatch = useDispatch();
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.questionData
  );
  const user = useSelector((state) => state.auth.user);

  const allQuestions = useSelector((state) => state.questionData.allQuestions);
  const studyTopicIdentifierElm = useRef();
  const studyNotesElm = useRef();
  const [questionsIDsToOutput, setQuestionsIDsToOutput] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [currentStudyNotesText, setCurrentStudyNotesText] = useState(
    studyNotes.studyNotes
  );
  // console.log(
  //   "%c --> %cline:12%cuser",
  //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //   "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
  //   user
  // );
  // console.log(
  //   "%c --> %cline:5%cstudyNotes",
  //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //   "color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px",
  //   studyNotes
  // );

  const studyTopicIDSubmitHandler = (e) => {
    e.preventDefault();

    const questionIdentifier = Object.keys(allQuestions).filter(
      (questionID) =>
        allQuestions[questionID]._id == studyTopicIdentifierElm.current.value
    );
    if (questionIdentifier.length <= 0) {
      setInputError(
        "That question ID does not appear in the list. Please make sure to copy and paste the full ID."
      );
    } else {
      const newStudyTopicsIDs = [
        ...studyNotes.studyTopicsIDs,
        questionIdentifier,
      ];
      const newStudyNotes = { ...studyNotes };
      newStudyNotes.studyTopicsIDs = newStudyTopicsIDs;
      dispatch(questionDataActions.addStudyTopicID(questionIdentifier));
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user)
        storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
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
    dispatch(questionDataActions.updateStudyNotes(studyNotesElm.current.value));
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
      newStudyNotes.studyNotes = [];
      console.log(
        "%c --> %cline:70%cnewStudyNotes",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
        newStudyNotes
      );
      dispatch(questionDataActions.clearStudyNotes());
      setCurrentStudyNotesText([]);
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user) storage("ADD", { newStudyNotes, ...otherQuestionData });
    }
  };

  useEffect(() => {
    console.log(
      "%c --> %cline:59%cinputError",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
      !!inputError
    );
    if (inputError) alert(inputError);
    setInputError(false);
  }, [inputError]);

  return (
    <div className={styles["study-notes-container"]}>
      <h2 className={"section-title " + styles["title"]}>Study Plan & Notes</h2>
      <div className={styles["study-topics-container"]}>
        <form className={styles["form"]} onSubmit={studyTopicIDSubmitHandler}>
          <h3 className={styles["title"]}>Study Needed</h3>
          <label for="">Question ID</label>
          <input
            key={Math.random()}
            name="Question ID"
            ref={studyTopicIdentifierElm}
          />
          <input type="submit" value="Submit" />
        </form>
        <div className={styles["study-list"]}>
          <h4>Study List</h4>
          <button onClick={clearListButtonHandler}>Clear Study Topics</button>
          <ul className={styles["study-list"]}>
            {studyNotes &&
              studyNotes.hasOwnProperty("studyTopicsIDs") &&
              studyNotes.studyTopicsIDs &&
              studyNotes.studyTopicsIDs.map((identifier) => {
                let output;
                if (allQuestions.hasOwnProperty(identifier))
                  output = (
                    <li>
                      <h4>{allQuestions[identifier].title}</h4>
                      <p>{allQuestions[identifier].topic}</p>
                      <div className={styles["button-wrap"]}>
                        <button className={styles["list-item-launch"]}>
                          Launch
                        </button>
                        <button className={styles["list-item-delete"]}>
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                return output;
              })}
          </ul>
        </div>
      </div>
      <form
        className={styles["form"]}
        onSubmit={studyNotesSubmitHandler}
        onChange={studyNotesOnChangeHandler}
      >
        <h3 className={styles["title"]}>Note Pad</h3>
        {currentStudyNotesText == studyNotes.studyNotes && (
          <input type="submit" value="Notes are saved" disabled />
        )}
        {currentStudyNotesText != studyNotes.studyNotes && (
          <input type="submit" value="Save Notes" />
        )}
        <textarea
          ref={studyNotesElm}
          className={styles["note-pad-textarea"]}
          value={currentStudyNotesText}
        />{" "}
        <button type="button" onClick={clearNotesButtonHandler}>
          Clear Study Notes
        </button>
      </form>{" "}
    </div>
  );
};

export default StudyNotes;
