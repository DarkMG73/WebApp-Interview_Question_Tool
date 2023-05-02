import styles from "./StatusUpdate.module.css";
import { useState, useEffect } from "react";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import { useSelector } from "react-redux";

const StatusUpdate = () => {
  const status = useSelector((state) => state.statusUpdate.status);
  const loadingStatus = useSelector(
    (state) => state.loadingRequests.pendingLoadRequests
  );

  const [statusText, setStatusText] = useState("Waiting...");
  const [errorStatus, setErrorStatus] = useState("all-fine");

  // if ((status && status.status >= 400) || (status && status.status === 0)) {
  //   setErrorStatus("error");
  // }

  useEffect(() => {
    if (loadingStatus >= 1)
      setStatusText(<span className={styles.transmit}>&#xbb;</span>);
  }, [loadingStatus]);

  useEffect(() => {
    if (
      status &&
      status.hasOwnProperty("rateLimitRemaining") &&
      status.rateLimitRemaining < 10
    ) {
      if (status.rateLimitRemaining <= 0) {
        setErrorStatus("error");
        setStatusText(
          "As a security measure, calls to the server are limited. Please wait about ten minutes before continuing. If this happens a lot, please contact the site admin."
        );
      } else {
        setErrorStatus("warning");
        setStatusText(
          "As a security measure, there are " +
            status.rateLimitRemaining +
            " calls to the server left. If the limit is reached, please wait about ten minutes before continuing."
        );
      }
    } else if (status && status.hasOwnProperty("statusText")) {
      if (
        (status >= 400 && status.statusText === "") ||
        status.statusText == 0
      ) {
        setErrorStatus("error");
        setStatusText(
          "There is an error communicating with the server. Please check your internet connection and refresh the browser."
        );
      } else if (status.statusText === "") {
        setErrorStatus("all-fine");
        setStatusText("OK");
      } else if (status.statusText.includes("Unauthorized")) {
        setStatusText("The user could not be logged in");
        setErrorStatus("all-fine");
      } else {
        setErrorStatus("all-fine");
        setStatusText(status.statusText);
      }
    }
  }, [status]);

  return (
    <div
      className={`${styles["status-update-container"]}  ${styles[errorStatus]}`}
    >
      <CardPrimary>
        <p>Server: {statusText}</p>
      </CardPrimary>
    </div>
  );
};

export default StatusUpdate;
