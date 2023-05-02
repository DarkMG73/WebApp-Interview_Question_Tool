import styles from "./BottomBar.module.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import StatusUpdate from "../../Components/StatusUpdate/StatusUpdate";
import TextZoomControls from "../../Components/TextZoomControls/TextZoomControls";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";

const BottomBar = () => {
  const user = useSelector((state) => state.auth.user);
  const [toggleLoginModal, setToggleLoginModal] = useState(false);

  const toggleLoginModalButtonHandler = () => {
    setToggleLoginModal(!toggleLoginModal);
  };
  const loginModalToggleStyles = toggleLoginModal
    ? { opacity: "1", pointerEvents: "all" }
    : {};

  useEffect(() => {}, [toggleLoginModal]);
  return (
    <div className={styles["bottom-bar"]}>
      <StatusUpdate />
      {user && (
        <p>
          Login Status: {user.userName ? user.userName : user.email} is
          currently logged in. &nbsp;&nbsp;
          <button
            onClick={toggleLoginModalButtonHandler}
            className={styles["login-bar-button"]}
          >
            LOGOUT
            <span className={styles["right-arrow"]}>&#x2192;</span>
          </button>
        </p>
      )}
      {!user && (
        <p>
          <span className={styles["not-logged-in"]}>
            No one is logged in.
            <button
              onClick={toggleLoginModalButtonHandler}
              className={styles["login-bar-button"]}
            >
              {" "}
              LOGIN or REGISTER HERE
              <span className={styles["right-arrow"]}>&#x2192;</span>
            </button>
          </span>
        </p>
      )}
      <TextZoomControls />
      <div className={styles["login-modal"]} style={loginModalToggleStyles}>
        <CardPrimary>
          <LoginStatus />
          <button onClick={toggleLoginModalButtonHandler}>Close</button>
          <StatusUpdate />
        </CardPrimary>
      </div>
    </div>
  );
};

export default BottomBar;
