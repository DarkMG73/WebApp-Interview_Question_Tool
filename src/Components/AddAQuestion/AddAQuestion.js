import { useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOn,
  signOut,
} from "firebase/auth";
import styles from "./AddAQuestion.module.css";
import { numberToText } from "../../hooks/utility";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionForm from "./AddAQuestionForm";
// import LoginHooks from "../../hooks/GoogleAuth/LoginHooks";
// import dbLogInHandler from "../../hooks/GoogleAuth/GoogleLogin";
// import LogoutHooks from "../../hooks/GoogleAuth/LogoutHooks";
import { auth } from "../../storage/firebase.config.js";

function AddAQuestion(props) {
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [user, setUser] = useState();

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  const logInButtonHandler = () => {
    console.log("click");
    setShowLoginForm(!showLoginForm);
  };
  const logInSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("click");
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setLoginError(false);
      console.log(
        "%c --> %cline:16%cuser",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
        user
      );
    } catch (error) {
      setLoginError(
        "Unfortunately, we could not log you in. Here is the error we received: " +
          error.message.replace("Firebase", "")
      );
      console.log(
        "%c --> %cline:18%cerror",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
        error.message
      );
    }
  };

  const logOutButtonHandler = async () => {
    console.log("click");
    try {
      const user = await signOut(auth);
      console.log(
        "%c --> %cline:67%cuser",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
        user
      );
      setLoginError(false);
    } catch (error) {
      setLoginError(
        "Unfortunately, we could not log you in. Here is the error we received: " +
          error.message.replace("Firebase", "")
      );
      console.log(
        "%c --> %cline:69%cerror",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
        error
      );
    }
  };
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
          multiple question at once. When they are all ready, click the{" "}
          <i>Submit</i> button. If you are logged in with the appropriate level
          the question will be immediately added. If not, the question will be
          submitted for review first before being added.
        </p>
        <p>Thanks for contributing!</p>
        <div
          id="db-login-wrap"
          className={`${styles["inner-wrap "]}  ${styles["db-login"]}`}
        >
          <p>
            Database login status:
            <span id="db-login-status">
              {user ? (
                <span> {user.email} is logged in. </span>
              ) : (
                <span> No one is currently logged in.</span>
              )}
            </span>
          </p>
          {!user && (
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
          )}
          {showLoginForm && !user ? (
            <form name="login-form" onSubmit={logInSubmitHandler}>
              <label for="login-email">Email Address</label>
              <input
                type="text"
                name="login-email"
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                }}
              />

              <label for="login-password">Email Address</label>
              <input
                type="text"
                name="login-password"
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                }}
              />

              <input type="submit" value="Submit" />
            </form>
          ) : (
            ""
          )}

          {user && (
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
          )}
          {loginError && <p>{loginError}</p>}
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
