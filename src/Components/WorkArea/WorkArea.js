import styles from "./WorkArea.module.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Iframe from "react-iframe";
import Timer from "../Timer/Timer";
import Answer from "../Answer/Answer";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";

function WorkArea(props) {
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const { timerRunning, quizInitiated } = useSelector((state) => state.timer);
  const answerElm = useRef();

  useEffect(() => {
    props.setScrollToAnswer(answerElm);
  }, []);

  useEffect(() => {
    if (!timerRunning && quizInitiated) {
      setQuestionCompleted(true);
    } else {
      setQuestionCompleted(false);
    }
  }, [timerRunning]);

  return (
    <div id="work-area" className={styles["outerwrap"]} ref={answerElm}>
      <h2 class="section-title">Answer Workspace</h2>
      <p>
        Use this console area as a scratchpad for working if you need. Many
        code-based question, especially the algorithm questions, will require
        detailed and working code examples. The console below allows for running
        that code to make sure it is a workable solution before ending the
        question and viewing the given answer.
      </p>
      <div
        id="user-interaction-area"
        className={styles["user-interaction-area"]}
      >
        {questionCompleted && <Answer />}
        <Timer />
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
