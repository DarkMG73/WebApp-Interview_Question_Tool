import styles from "./Login.module.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormInput from "../../../UI/Form/FormInput/FormInput";
import { sign_inAUser, setUserCookie } from "../../../storage/userDB";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import { authActions } from "../../../store/authSlice";
import { useRunGatherQuestionData } from "../../../Hooks/useRunGatherQuestionData";
import { questionDataActions } from "../../../store/questionDataSlice";
import { loadingRequestsActions } from "../../../store/loadingRequestsSlice";
import Iframe from "react-iframe";
import { statusUpdateActions } from "../../../store/statusUpdateSlice";

const Login = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const runGatherQuestionData = useRunGatherQuestionData();
  const [loginError, seLoginError] = useState(false);
  const [showLoginError, setShowLoginError] = useState(true);
  const [showChangePasswordHTML, setShowChangePasswordHTML] = useState(false);
  const dispatch = useDispatch();
  const horizontalDisplay = props.horizontalDisplay ? "horizontal-display" : "";
  const [serverActiveError, setServerActiveError] = useState(false);
  const status = useSelector((state) => state.statusUpdate.status);

  let forgotPasswordURL =
    "https://api-iq.glassinteractive.com/api/users/auth/forgot_password?";
  if (process.env.NODE_ENV === "development") {
    forgotPasswordURL = "http://localhost:8000/api/users/auth/forgot_password?";
  }

  ////////////////////////////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (process.env.NODE_ENV === "development")
      console.log(
        "%cForgot Password URL:",
        "color:#fff;background:#287094;padding:5px;border-radius:0 25px 25px 0",
        forgotPasswordURL
      );
  }, []);

  useEffect(() => {
    if (loginError)
      dispatch(
        statusUpdateActions.updateStatus({
          ...status,
        })
      );
  }, [loginError]);

  ////////////////////////////////////////////////////////////////
  /// Functinality
  ////////////////////////////////////////////////////////////////
  // This is kept for reference, but teh URL encoded version is used.
  let forgotPWPlaceholder = (
    <div
      style="font: normal 500 12px Kodchasan, sans-serif;
    background: #287094;
    color: var(--iq-color-background-warm);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    margin: 0;
    max-height: 100%;
    text-align: center;
    min-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    max-width: 100%;
    max-height: 100%;"
    >
      <h3 style="margin: 1% 5%;">
        It looks like there is a server issue. Please try again shortly. If the
        problem continues, please contact the site administrator. 😢
      </h3>
    </div>
  );
  // forgotPWPlaceholder has been URL encoded
  // below via https://www.urlencoder.org/.
  forgotPWPlaceholder =
    "data:text/html;charset=utf-8,%20%20%20%20%3Cdiv%0A%20%20%20%20%20%20style%3D%22font%3A%20normal%20500%2012px%20Kodchasan%2C%20sans-serif%3B%0A%20%20%20%20background%3A%20%23287094%3B%0A%20%20%20%20color%3A%20hsl%2860deg%206%25%2093%25%29%3B%0A%20%20%20%20display%3A%20flex%3B%0A%20%20%20%20justify-content%3A%20center%3B%0A%20%20%20%20align-items%3A%20center%3B%0A%20%20%20%20min-height%3A%20100%25%3B%0A%20%20%20%20margin%3A%200%3B%0A%20%20%20%20max-height%3A%20100%25%3B%0A%20%20%20%20text-align%3A%20center%3B%0A%20%20%20%20min-width%3A%20100%25%3B%0A%20%20%20%20position%3A%20absolute%3B%0A%20%20%20%20top%3A%200%3B%0A%20%20%20%20left%3A%200%3B%0A%20%20%20%20max-width%3A%20100%25%3B%0A%20%20%20%20max-height%3A%20100%25%3B%22%0A%20%20%20%20%3E%0A%20%20%20%20%20%20%3Ch3%20style%3D%22margin%3A%201%25%205%25%3B%22%3E%0A%20%20%20%20%20%20%20%20It%20looks%20like%20there%20is%20a%20server%20issue.%20Please%20try%20again%20shortly.%20If%20the%0A%20%20%20%20%20%20%20%20problem%20continues%2C%20please%20contact%20the%20site%20administrator.%20%F0%9F%98%A2%0A%20%20%20%20%20%20%3C%2Fh3%3E%0A%20%20%20%20%3C%2Fdiv%3E";

  const makeLoadingRequest = function () {
    return dispatch(loadingRequestsActions.addToLoadRequest());
  };

  const removeLoadingRequest = function () {
    dispatch(loadingRequestsActions.removeFromLoadRequest());
  };

  const completeSignInProcedures = (res) => {
    seLoginError(false);
    makeLoadingRequest();
    // storage("add", res.data);

    setUserCookie(res.data).then((res) => {
      if (process.env.NODE_ENV === "development")
        console.log(
          "%cSetting User Cookie:",
          "color:#287094;background:#f0f0ef;padding:5px;border-radius:0 25px 25px 0",
          res
        );
    });

    dispatch(authActions.logIn(res.data));
    runGatherQuestionData({ user: res.data });
    removeLoadingRequest();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const groomedName = name.split("#")[1];
    setUser({
      ...user, //spread operator
      [groomedName]: value,
    });
  };

  const errorDisplayButtonHandler = () => {
    setShowLoginError(!showLoginError);
  };
  const requestNewPasswordButtonHandler = (e) => {
    e.preventDefault();
      window.open(forgotPasswordURL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
    // const myRequest = new Request(
    //  forgotPasswordURL
    // );

    // fetch(myRequest)
    //   .then(function (response) {
    //     setServerActiveError(false);
    //   })
    //   .catch(function (error) {
    //     console.log(
    //       "%cERROR:",
    //       "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
    //       error
    //     );
    //     setServerActiveError(true);
    //   });

    // setShowChangePasswordHTML(!showChangePasswordHTML);
  };

  //register function
  const submitLogin = (e) => {
    e.preventDefault();
    const { email, password } = user;

    if (email && password) {
      makeLoadingRequest();
      // axios("http://localhost:8000/api/users/auth/register", user)
      sign_inAUser(user)
        .then((res) => {
          removeLoadingRequest();
          if (res && res.hasOwnProperty("status")) {
            if (res.status >= 200 && res.status < 400) {
              completeSignInProcedures(res);
            } else if (res.status === 0 || res.status === 404) {
              seLoginError(
                "There was a problem finding the user database. Make sure you are connected to the internet. Contact the site admin if the problem continues. Error: " +
                  res.status +
                  " | " +
                  res.statusText
              );
              setShowLoginError(true);
            } else if (res.status >= 400) {
              let groomedErrorMessage =
                "No error message given| Status is " + res.status;
              if (res.hasOwnProperty("data")) {
                if (res.data.hasOwnProperty("message"))
                  groomedErrorMessage = res.data.message;
                if (res.data.hasOwnProperty("statusText"))
                  groomedErrorMessage = res.statusText;
              }
              seLoginError(groomedErrorMessage);
              setShowLoginError(true);
            }
          } else if (res && res.hasOwnProperty("data")) {
            if (res.data) {
              completeSignInProcedures(res);
            } else {
              seLoginError(
                "There was a problem finding the user database. Make sure you are connected to the internet. Contact the site admin if the problem continues. Error: " +
                  res.status +
                  " | " +
                  res.statusText
              );
              setShowLoginError(true);
            }
          } else {
            seLoginError(
              "Unfortunately, something went wrong and we can not figure out what happened.  Please refresh and try again."
            );
            setShowLoginError(true);
          }
        })
        .catch((err) => {
          removeLoadingRequest();
          seLoginError(err);
          setShowLoginError(true);
        });
    } else {
      seLoginError(
        "Either the email or password is not meeting the requirements. Please fix and try again."
      );
      setShowLoginError(true);
    }
  };

  if (loginError)
    console.log(
      "%cThere was a Login Error:",
      "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
      loginError
    );

  ////////////////////////////////////////////////////////////////
  /// Output
  ////////////////////////////////////////////////////////////////
  return (
    <div
      className={styles["login-container"] + " " + styles[horizontalDisplay]}
    >
      {!props.hideTitles && (
        <div className={styles["login-title-wrap"]}>
          <h3 className={styles["login-title"]}>Login</h3>
        </div>
      )}
      <span className={styles["login-question"]}>
        Need to register?
        <PushButton
          inputOrButton="button"
          id="create-entry-btn"
          colorType="primary"
          value="Add a Question"
          data=""
          size="small"
          onClick={props.toggleSignupLoginButtonHandler}
          styles={props.signUpButtonStyles}
        >
          Sign Up &#10140;
        </PushButton>
      </span>
      <div className={styles["login-form-wrap"]}>
        <form className={styles["form"]} action="#">
          <div className={styles["form-input-container"]}>
            <FormInput
              key={"register-4"}
              formNumber={1}
              inputDataObj={{
                name: "email",
                title: "Email",
                type: "email",
                value: user.email,
                placeholder: "Email Address",
              }}
              requiredError={{}}
              onChange={handleChange}
            />
          </div>

          <div className={styles["form-input-container"]}>
            <FormInput
              key={"register-4"}
              formNumber={1}
              inputDataObj={{
                name: "password",
                title: "Password",
                type: "password",
                value: user.password,
                placeholder: "Password",
              }}
              requiredError={{}}
              onChange={handleChange}
            />
          </div>

          <div className={styles["form-submit-button-wrap"]}>
            <PushButton
              inputOrButton="button"
              id="create-entry-btn"
              colorType="primary"
              value="Login"
              data=""
              size="medium"
              onClick={submitLogin}
            >
              Login
            </PushButton>
          </div>
        </form>{" "}
        {loginError && showLoginError && (
          <div className={styles["form-input-error"]}>
            <button
              className={styles["form-input-error-close-button"]}
              onClick={errorDisplayButtonHandler}
            >
              X
            </button>
            <p>{loginError}</p>
          </div>
        )}{" "}
        <PushButton
          inputOrButton="button"
          id="create-entry-btn"
          colorType="secondary"
          styles={{ margin: "1em" }}
          value="Login"
          data=""
          size="small"
          onClick={requestNewPasswordButtonHandler}
        >
          Need to reset your password?
        </PushButton>
        {showChangePasswordHTML && (
          <Iframe
            styles={{
              border: "none",
              borderRadius: "30px",
              boxShadow: "-2px -2px 3px -2px black, 2px 2px 3px -2px white",
              margin: "0",
            }}
            height="auto"
            width="100%"
            scrolling="no"
            title="Forgot Password Display"
            src={serverActiveError ? forgotPWPlaceholder : forgotPasswordURL}
            frameborder="no"
            loading="lazy"
            allowtransparency="true"
            allowfullscreen="true"
          >
            You need a Frames Capable browser to view this content.
          </Iframe>
        )}
      </div>
    </div>
  );
};
export default Login;
