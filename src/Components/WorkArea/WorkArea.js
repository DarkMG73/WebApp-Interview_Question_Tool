import styles from "./WorkArea.module.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Iframe from "react-iframe";
import Timer from "../Timer/Timer";
import Answer from "../Answer/Answer";

function WorkArea(props) {
  const [questionCompleted, setQuestionCompleted] = useState(false);
  console.log(
    "%c --> %cline:9%cquestionCompleted",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
    questionCompleted
  );
  const { timerRunning, quizInitiated } = useSelector((state) => state.timer);
  console.log(
    "%c &&&&&&&&&&&&&&&&& %cline:17%ctimerRunning",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
    timerRunning
  );

  useEffect(() => {
    console.log(
      "%c ******TIMER RUNNING ********** %cline:13%ctimerRunning",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
      timerRunning
    );
    if (!timerRunning && quizInitiated) {
      setQuestionCompleted(true);
      console.log(
        "%c ******TIMER IS NOT  RUNNING ********** %cline:13%ctimerRunning",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
        timerRunning
      );
    }
  }, [timerRunning]);

  console.log(
    "%c --> %cline:51%cquestionCompleted",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
    questionCompleted
  );
  return (
    <div id="work-area" className={styles["outerwrap"]}>
      <div id="user-interaction-area" className="outer-wrap">
        <div id="timer">
          Time: <Timer />
        </div>
        {questionCompleted && <Answer />}
        <div id="question-info" className="outer-wrap">
          <Iframe
            height="400px"
            width="100%"
            src="https://repl.it/@DarkMG73/InterviewQuestionWorkspace?lite=true"
            scrolling="no"
            frameborder="no"
            allowtransparency="true"
            allowfullscreen="true"
            sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"
          ></Iframe>
          <div id="output" className="inner-wrap closed"></div>
        </div>
      </div>
    </div>
  );
}

export default WorkArea;
