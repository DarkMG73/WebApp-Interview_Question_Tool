import styles from "./SessionResultsRow.module.css";
import { useState, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl } from "../../Hooks/utility";
import Card from "../../UI/Cards/Card/Card";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import { addDocToDB, deleteDocFromDb } from "../../storage/firebase.config";
import { updateAQuestion } from "../../storage/interviewQuestionsDB";

function SessionResultsRow(props) {
  const dispatch = useDispatch();
  const [inEditMode, setInEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const editedQuestions = useRef({ edits: {} });
  const { allQuestions } = useSelector((state) => state.questionData);
  const refToScrollTo = useRef();
  const shouldBeOpen = inEditMode ? inEditMode : props.open;
  // props.refToPass(refToScrollTo);
  console.log(
    "%c --> %cline:17%crefToScrollTo",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
    refToScrollTo
  );
  const questionHistory = props.questionHistory;

  const key = props.keyTwo;
  const k = props.keyOne;
  // editButtonDirection to be used with future edit mode visual manipulations
  const editButtonDirection = inEditMode ? "" : "";
  const editButtonWidth = inEditMode ? "max-content" : "5em";
  const user = useSelector((state) => state.auth.user);

  const rowEditButtonHandler = (e, setElmOpen) => {
    setInEditMode(!inEditMode);
  };

  const rowSaveButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";
    // updateAQuestion(key, editedQuestions.current.edits[key], user);

    if (user && user.isAdmin == true) {
      updateAQuestion(
        questionHistory[k][key].identifier,
        editedQuestions.current.edits[key],
        user
      ).then((res) => {
        console.log(
          "%c --> %cline:47%cres",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
          res
        );

        const status = res.status ? res.status : res.response.status;
        if (status >= 400) {
          alert("There was an error: " + res.response.data.message);
        } else if (status >= 200) {
          alert("Success! The item has been updated.");
          setInEditMode(false);
        } else {
          alert("there was an error: " + +res.message);
        }
      });
    } else {
      const sendEmail = window.confirm(
        'Thank you for contributing. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be included. Click "Cancel" to cancel this and not send an email.'
      );
      if (sendEmail) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A Question Edit Request for the Interview Questions Tool";
        const body = `A question edit is being recommended: ${JSON.stringify(
          editedQuestions.current.edits
        )}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${encodeURIComponent(
            body
          )}`
        );
      }
    }
  };

  const deleteQuestionButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";
    if (user) {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this question (ID: " + key + ")"
      );
      if (shouldDelete) {
        deleteDocFromDb(key);
        setDeleted(true);
      }
    } else {
      const sendEmail = window.confirm(
        'Thank you for your suggestion to remove this question. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be deleted. Click "Cancel" to cancel this and not send an email.'
      );
      if (sendEmail) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A Recommendation to Remove a Question from the Interview Questions Tool";
        const body = `It is recommended that this question be removed: ${JSON.stringify(
          editedQuestions.current.edits
        )}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${encodeURIComponent(
            body
          )}`
        );
      }
    }
  };

  function AssembleInnerRow(questionHistory, k, key, elmOpen, setElmOpen) {
    let rowHTML = [];

    function onTextChangeHandler(e, key, itemKey) {
      if (!editedQuestions.current.edits.hasOwnProperty(key))
        editedQuestions.current.edits[key] = {};

      editedQuestions.current.edits[key][itemKey] = e.target.innerText;
    }

    for (const itemKey in questionHistory[k][key]) {
      let value = allQuestions[key]
        ? allQuestions[key][itemKey]
        : questionHistory[k][key][itemKey];
      let itemTitle = itemKey;

      // Skip if no value
      if (value == undefined || value === "" || value == " ") continue;

      // If link, add <a> tag
      const isValidLink = isValidHttpUrl(value);
      if (isValidLink) {
        value = (
          <a href={value} alt={itemKey} target="_blank">
            {value}
          </a>
        );
      }

      // Wrap the Answer to handle code-based answers
      if (itemKey === "answer" || itemKey === "question") {
        value = (
          <Fragment>
            <CollapsibleElm
              id={key + "-" + itemKey + "-see-more-btn"}
              maxHeight="7em"
              inputOrButton="button"
              buttonStyles={{
                margin: "0 auto",
                letterSpacing: "0.25em",
                fontVariant: "small-caps",
                transform: "translateY(100%)",
                minWidth: "5em",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
              }}
              colorType="primary"
              data=""
              size="small"
              open={props.open}
            >
              <pre>
                <code contentEditable={inEditMode}>{value}</code>
              </pre>
            </CollapsibleElm>
          </Fragment>
        );
      }

      // Change "question" as the title
      if (itemKey === "question") {
        itemTitle = "Details";
      }
      // Create the row
      rowHTML.push(
        <div
          key={key + "-" + itemKey}
          id={key + "-" + itemKey}
          className={styles[itemKey] + " " + styles["grid-item"]}
        >
          <div
            className={`${styles[itemKey]} ${styles[itemKey + "-title"]}
               ${styles["grid-item-title"]} 
               ${styles["grid-item-child"]}`}
          >
            {itemTitle}
          </div>
          <div
            className={`${styles[itemKey]} ${styles[itemKey + "-text"]}
            ${styles["grid-item-text"]} 
            ${styles["grid-item-child"]}`}
            contentEditable={inEditMode}
            ref={(elm) => {
              //  Moving this out of processing to handle after elements added.
              setTimeout(() => {
                if (editedQuestions.current.edits[itemKey])
                  editedQuestions.current.edits[itemKey] = elm.innerText;
              }, 0);
            }}
            onBlur={(e) => {
              onTextChangeHandler(e, key, itemKey);
            }}
          >
            {value}
          </div>
        </div>
      );
    }

    return rowHTML;
  }

  // Add the edit button
  const output = (
    <div
      key={key}
      id={key}
      className="question-result-container"
      ref={refToScrollTo}
    >
      <Card>
        <CollapsibleElm
          id={key + "-collapsible-elm"}
          styles={{
            position: "relative",
          }}
          maxHeight="4em"
          inputOrButton="button"
          buttonStyles={{
            margin: "0 auto",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            transform: "translateY(100%)",
            transition: "0.7s all ease",
            minWidth: "5em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
          colorType="primary"
          data=""
          size="small"
          open={shouldBeOpen}
        >
          {AssembleInnerRow(questionHistory, k, key)}
          <div className={styles["button-container"]}>
            <PushButton
              inputOrButton="button"
              styles={{
                gridArea: "edit",
                background: "transparent",
                boxShadow: "none",
                letterSpacing: "0.25em",
                fontVariant: "small-caps",
                transform: editButtonDirection,
                minWidth: editButtonWidth,
                textAlign: "center",
                display: "flex",
                alignItems: "flex-end",
                margin: "auto",
                padding: "0.75em",
              }}
              id={key + "edit-button"}
              colorType="secondary"
              value="session-record"
              data=""
              size="small"
              onClick={rowEditButtonHandler}
            >
              {inEditMode ? "Cancel Edit" : "Edit"}
            </PushButton>
            {inEditMode && (
              <>
                <PushButton
                  inputOrButton="input"
                  styles={{
                    type: "submit",
                    gridArea: "edit",
                    boxShadow: "none",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    minWidth: "fit-content",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "110%",
                  }}
                  id={key + "submit-button"}
                  colorType="primary"
                  value="Save Changes"
                  data=""
                  size="small"
                  onClick={rowSaveButtonHandler}
                >
                  Save Changes
                </PushButton>
                <PushButton
                  inputOrButton="input"
                  styles={{
                    type: "submit",
                    gridArea: "edit",
                    boxShadow: "none",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    minWidth: "fit-content",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "80%",
                  }}
                  id={key + "delete-button"}
                  colorType="secondary"
                  value="Delete Question"
                  data=""
                  size="small"
                  onClick={deleteQuestionButtonHandler}
                >
                  Delete Question
                </PushButton>
                <div className={styles["question-id"]}>
                  <p>
                    Question ID:
                    <br />
                    {key}
                  </p>
                </div>
              </>
            )}
          </div>
        </CollapsibleElm>
      </Card>
    </div>
  );

  if (!deleted) {
    return output;
  } else {
    return (
      <div className={styles.deleted}>
        <h3>This question was deleted (ID: {key})</h3>
      </div>
    );
  }
}

export default SessionResultsRow;
