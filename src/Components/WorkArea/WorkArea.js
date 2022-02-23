import styles from "./WorkArea.module.css";
import Iframe from "react-iframe";

function WorkArea(props) {
  return (
    <div id="word-area" className={styles.outerwrap}>
      <div id="user-interaction-area" className="outer-wrap">
        <div id="timer">00:00</div>
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
