import GatherQuestionData from "./GatherQuestionData";
import { questionDataActions } from "../store/questionDataSlice";
import { loadingRequestsActions } from "../store/loadingRequestsSlice";
import { useSelector, useDispatch } from "react-redux";
import { statusUpdateActions } from "../store/statusUpdateSlice";

export const useRunGatherQuestionData = (props) => {
  const makeLoadingRequest = function () {
    return dispatch(loadingRequestsActions.addToLoadRequest());
  };
  const removeLoadingRequest = function () {
    dispatch(loadingRequestsActions.removeFromLoadRequest());
  };
  const currentStatus = useSelector((state) => state.statusUpdate);
  const dispatch = useDispatch();

  const runGatherQuestionData = (props) => {
    console.log(
      "%c --> %cline:6%cprops",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
      props
    );
    const user = props.user;
    const setLocalError = props.setLocalError;
    makeLoadingRequest();
    GatherQuestionData(user)
      .then((data) => {
        if (process.env.NODE_ENV === "development")
          console.log(
            "%c Getting tool data from DB:",
            "color:#fff;background:#777;padding:14px;border-radius:0 25px 25px 0",
            data
          );
        dispatch(questionDataActions.initState(data));
        if (user) {
          dispatch(
            statusUpdateActions.updateStatus({
              status: currentStatus.status,
              statusText: "OK",
              rateLimitRemaining: currentStatus.rateLimitRemaining,
            })
          );
        } else {
          dispatch(
            statusUpdateActions.updateStatus({
              status: currentStatus.status,
              statusText: "OK. Saving to Browser Storage.",
              rateLimitRemaining: currentStatus.rateLimitRemaining,
            })
          );
        }
      })
      .catch((err) => {
        console.log(
          "%c --> GatherToolData: err: ",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        if (err.hasOwnProperty("status") && err.status >= 500) {
          setLocalError({
            active: true,
            message:
              " *** " +
              err.statusText +
              `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`,
          });
        } else if (err.hasOwnProperty("status")) {
          console.log(
            "%c --> %cline:55%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(114, 83, 52);padding:3px;border-radius:2px",
            err
          );
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              err.request.responseURL,
          });
        } else {
          console.log(
            "%c --> %cline:66%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
            err
          );

          const responseURL =
            err.hasOwnProperty("request") &&
            err.request.hasOwnProperty("responseURL")
              ? err.request.responseURL
              : "";
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              responseURL,
          });
        }
      });

    removeLoadingRequest();
  };
  return runGatherQuestionData;
};
