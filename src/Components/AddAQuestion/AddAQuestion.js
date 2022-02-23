import styles from "./AddAQuestion.module.css";
import { numberToText } from "../../hooks/utility";

function AddAQuestion(props) {
  return (
    <div id="output-controls" className={styles.outerwrap}>
      <div id="add-quest-wrap" className={styles["add-quest-wrap"]}>
        <h2>Add Questions Here</h2>
        <p>
          To add questions to this tool, simply click the{" "}
          <i>Create an Entry Form</i> button and fill out the small form. Feel
          free to click the same button to create as many forms as needed to add
          multiple uestion at once. When they are all ready, click the{" "}
          <i>Submit</i> button. If you are logged in with the appropriate level
          the question will be imedialtely added. If not, the question will be
          submitted for review first before being added.Thanks for contributing!
        </p>
        <div
          id="db-login-wrap"
          className={`${styles["inner-wrap "]}  ${styles["db-login"]}`}
        >
          <p>
            Database login status: <span id="db-login-status"></span>
          </p>
          <button id="login-to-db" className={styles["button"]}>
            Log In
          </button>
          <button id="logout-from-db" className={styles["button"]}>
            Log Out
          </button>
        </div>
        <button id="create-entry-btn" className={styles["button"]}>
          Create an Entry Form
        </button>
        <form
          action=""
          id="add-quest-form"
          className={styles["inner-wrap form"]}
        >
          <input
            type="submit"
            id="quest-submit-btn"
            className={styles["button"]}
          />
        </form>
      </div>
    </div>
  );
}

export default AddAQuestion;
