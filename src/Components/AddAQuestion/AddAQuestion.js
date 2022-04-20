import { useState } from "react";
import styles from "./AddAQuestion.module.css";
import { numberToText } from "../../hooks/utility";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionForm from "./AddAQuestionForm";
import LoginHooks from "../../hooks/GoogleAuth/LoginHooks";
import LogoutHooks from "../../hooks/GoogleAuth/LogoutHooks";

function AddAQuestion(props) {
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);

  function logInButtonHandler() {
    console.log("click");
  }
  function logOutButtonHandler() {
    console.log("click");
  }
  function showNewQuestionFormButtonHandler() {
    console.log(
      "%c --> %cline:8%cshowAddQuestionForm",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
      showAddQuestionForm
    );
    console.log("click");
    setShowAddQuestionForm(!showAddQuestionForm);
    console.log(
      "%c --> %cline:8%cshowAddQuestionForm",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
      showAddQuestionForm
    );
  }
  return (
    <div id="output-controls" className={styles.outerwrap}>
      <div id="add-quest-wrap" className={styles["add-quest-wrap"]}>
        <h2 class="section-title">Add Questions Here</h2>
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
            <LoginHooks />
            <LogoutHooks />
          </p>
          <PushButton
            inputOrButton="button"
            id="login-to-db"
            colorType="primary"
            value="login to db"
            data=""
            size="small"
            onClick={logInButtonHandler}
          >
            Log In
          </PushButton>
          <PushButton
            inputOrButton="button"
            id="logout-from-db"
            colorType="primary"
            value="logout from db"
            data=""
            size="small"
            onClick={logOutButtonHandler}
          >
            LogOut
          </PushButton>
          <PushButton
            inputOrButton="button"
            id="create-entry-btn"
            colorType="primary"
            value="Add a Question"
            data=""
            size="small"
            onClick={showNewQuestionFormButtonHandler}
          >
            {showAddQuestionForm && (
              <span>
                <b>Cancel</b> the Question Entry Form
              </span>
            )}
            {!showAddQuestionForm && <span>Show the Question Entry Form</span>}
          </PushButton>
          {showAddQuestionForm && <AddAQuestionForm />}
        </div>
      </div>
    </div>
  );
}

export default AddAQuestion;
