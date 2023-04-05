import styles from "./BottomBar.module.css";
import { useSelector } from "react-redux";
import StatusUpdate from "../../Components/StatusUpdate/StatusUpdate";
import TextZoomControls from "../../Components/TextZoomControls/TextZoomControls";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";

const BottomBar = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles["bottom-bar"]}>
      <StatusUpdate />
      {user && (
        <p>
          Login Status: {user.userName ? user.userName : user.email} is
          currently logged in.
        </p>
      )}
      {!user && (
        <p>
          <span className={styles["not-logged-in"]}>
            No one is logged in.{" "}
            <a href="#">
              LOGIN or REGISTER HERE
              <span className={styles["right-arrow"]}>&#x2192;</span>
            </a>
          </span>
        </p>
      )}
      <TextZoomControls />
    </div>
  );
};

export default BottomBar;
