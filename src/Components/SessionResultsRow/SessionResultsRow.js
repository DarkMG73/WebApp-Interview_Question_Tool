import styles from "./SessionResultsRow.module.css";
import { useState, useEffect, useRef, Fragment } from "react";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl } from "../../hooks/utility";
import Card from "../../UI/Cards/Card/Card";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import { addDocToDB, deleteDocFromDb } from "../../storage/firebase.config";

function SessionResultsRow(props) {
  const [inEditMode, setInEditMode] = useState(false);
  const editedQuestions = useRef({ edits: {} });
  console.log(
    "%c --> %cline:10%ceditedQuestions",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
    editedQuestions
  );
  const questionHistory = props.questionHistory;
  const key = props.keyTwo;
  const k = props.keyOne;
  // editButtonDirection to be used with future edit mode visual manipulations
  const editButtonDirection = inEditMode ? "" : "";
  const editButtonWidth = inEditMode ? "max-content" : "5em";

  const rowEditButtonHandler = (e, setElmOpen) => {
    console.log("Edit Clicked", e.target);
    setInEditMode(!inEditMode);
  };

  const rowSaveButtonHandler = (e) => {
    //TODO: CHANGE TO key WHEN MOVING TO PRODUCTION
    const tempKey = "TESTTEST";
    addDocToDB(tempKey, editedQuestions.current.edits);
  };

  const deleteQuestionButtonHandler = (e) => {
    //TODO: CHANGE TO key WHEN MOVING TO PRODUCTION
    const tempKey = "TESTTEST";
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this question (ID: " + key + ")"
    );
    if (shouldDelete) deleteDocFromDb(tempKey);
  };

  function AssembleInnerRow(questionHistory, k, key, elmOpen, setElmOpen) {
    let rowHTML = [];

    function onTextChangeHandler(e, itemKey) {
      editedQuestions.current.edits[itemKey] = e.target.innerText;
    }
    for (const itemKey in questionHistory[k][key]) {
      let value = questionHistory[k][key][itemKey];
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
                editedQuestions.current.edits[itemKey] = elm.innerText;
                console.log(
                  "%c --> %cline:160%celm.innerText",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
                  elm.innerText
                );
              }, 0);
            }}
            onBlur={(e) => {
              onTextChangeHandler(e, itemKey);
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
    <div key={key} id={key} class="question-result-container">
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
          open={inEditMode}
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

  return output;
}

export default SessionResultsRow;
