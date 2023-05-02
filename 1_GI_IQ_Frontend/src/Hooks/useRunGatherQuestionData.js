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
    const user = props.user;
    const setLocalError = props.setLocalError;
    makeLoadingRequest();
    GatherQuestionData(user)
      .then((data) => {
        if (process.env.NODE_ENV === "development")
          console.log(
            "%c Getting tool data from DB:",
            "color:#fff;background:#777;padding:5px;border-radius:0 25px 25px 0",
            data
          );
        dispatch(questionDataActions.initState(data));
        if (user) {
          dispatch(
            statusUpdateActions.updateStatus({
              status: currentStatus.status ? currentStatus.status : 200,
              statusText: "OK",
              rateLimitRemaining: currentStatus.rateLimitRemaining,
            })
          );
        } else {
          if (currentStatus && currentStatus.status)
            dispatch(
              statusUpdateActions.updateStatus({
                status: 200,
                statusText: "OK. Saving to Browser Storage.",
                rateLimitRemaining: currentStatus.rateLimitRemaining,
              })
            );
        }
      })
      .catch((err) => {
        console.log(
          "%cGatherToolData: err:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
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
            "%cGatherToolData: err:",
            "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
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
            "%cGatherToolData: err:",
            "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
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
