import styles from "./WorkArea.module.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Iframe from "react-iframe";
import Timer from "../Timer/Timer";
import Answer from "../Answer/Answer";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";

function WorkArea(props) {
  const [questionCompleted, setQuestionCompleted] = useState(false);

  const { timerRunning, quizInitiated } = useSelector((state) => state.timer);

  useEffect(() => {
    if (!timerRunning && quizInitiated) {
      setQuestionCompleted(true);
    } else {
      setQuestionCompleted(false);
    }
  }, [timerRunning]);

  return (
    <div id="work-area" className={styles["outerwrap"]}>
      <div id="user-interaction-area" className="outer-wrap">
        {questionCompleted && (
          <CardPrimary>
            <Answer />
          </CardPrimary>
        )}
        <div id="timer">
          Time: <Timer />
        </div>
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
