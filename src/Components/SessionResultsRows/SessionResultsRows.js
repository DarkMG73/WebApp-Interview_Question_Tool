import { useState } from "react";
import styles from "./SessionResultsRows.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl } from "../../hooks/utility";
import Card from "../../UI/Cards/Card/Card";

function SessionResultsRows(props) {
  const questionHistory = props.questionHistory;
  const questionHistoryRows = [];

  const rowEditButtonHandler = (e) => {
    console.log("Edit Clicked", e.target);
  };

  for (const k in questionHistory) {
    for (const key in questionHistory[k]) {
      let rowHTML = [];
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
          console.log("value", value);
          value = (
            <pre>
              <code>{value}</code>
            </pre>
          );
        }

        // Change "question" as the title
        if (itemKey === "question") {
          itemTitle = "Details";
        }

        // Create the row
        rowHTML.push(
          <div
            key={k + "-" + key + "-" + itemKey}
            id={k + "-" + key + "-" + itemKey}
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
            >
              {value}
            </div>
          </div>
        );
      }

      // Add the edit button
      rowHTML.push(
        <PushButton
          inputOrButton="button"
          styles={{
            gridArea: "edit",
            background: "transparent",
            boxShadow: "none",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            transform: "rotate(-90deg)",
            minWidth: "5em",
            textAlign: "center",
            display: "flex",
            alignItems: "flex-end",
          }}
          id={key}
          colorType="secondary"
          value="session-record"
          data=""
          size="small"
          onClick={rowEditButtonHandler}
        >
          Edit
        </PushButton>
      );
      // Add the row
      questionHistoryRows.push(rowHTML);
    }
  }

  console.log(
    "%c --> %cline:30%cquestionHistoryRows",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
    questionHistoryRows
  );

  return (
    <div className={styles["session-results-container"]}>
      {questionHistoryRows.map((item) => {
        console.log(item);
        return (
          <div key={item.id}>
            <Card>{item}</Card>
          </div>
        );
      })}
    </div>
  );
}

export default SessionResultsRows;
