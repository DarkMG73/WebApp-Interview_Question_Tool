import { useState } from "react";
import {
  getUserCookie,
  sign_inAUser,
  getUserUserByToken,
} from "../storage/userDB";
import { useRunGatherQuestionData } from "./useRunGatherQuestionData";

export const useUserDataInit = (props) => {
  const runGatherQuestionData = useRunGatherQuestionData();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState("not logged in");

  const userDataInit = (props) => {
    const setLocalError = props.setLocalError;
    const setUser = props.setUser;
    console.log(
      "%c --> %cline:8%cprops",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
      props
    );
    getUserCookie()
      .then((res) => {
        console.log(
          "%c --> %cline:24%cres",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
          res
        );
        // if no cookie or error
        if (res.status >= 400) {
          console.log(
            "%c --> %cline:26%cres.status >= 400",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
            res.status >= 400
          );
          setUser("not logged in");
        } else {
          console.log(
            "%c --> %cline:36%cres.data",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
            res.data
          );
          getUserUserByToken(res.data.cookie) // data from API.
            .then((userProfile) => {
              console.log(
                "%c --> %cline:38%cuserProfile",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
                userProfile
              );
              // User does not exist or has timed out.
              if (userProfile.status >= 400) {
                setUser("not logged in");
              } else {
                console.log(
                  "%c --> %cline:38%cuserProfile-IN",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px"
                );
                // trigger user login & user data setup via useEffect below.
                // Local state used to avoid following extra useEffect trigger on startup.
                setUser({ ...userProfile, token: res.data.cookie });
              }
            })
            .catch((err) => {
              console.log(
                "%c --> GatherToolData: err: ",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
                err
              );
            });
        }
      })
      .catch((err) => {
        console.log(
          "%c --> GatherToolData: err: ",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        setLocalError({
          active: true,
          message: " An error: " + err.toString(),
        });
      });
  };

  return userDataInit;
};
