import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./SessionResults.module.css";
import Score from "../../Components/Score/Score";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";

function SessionResults(props) {
  const questionHistory = useSelector(
    (state) => state.questionData.questionHistory
  );
  const sessionResultsBox = useRef();

  useEffect(() => {
    props.setScrollToSessionResults(sessionResultsBox);
  }, []);

  return (
    <div
      id="session-results"
      className={styles.outerwrap}
      ref={sessionResultsBox}
    >
      <h2 class="section-title">Session Results</h2>
      <Score
        title={false}
        showResetBtn={true}
        showCorrect={true}
        showIncorrect={true}
        showUnmarked={true}
        showCount={true}
      />
      <CollapsibleElm
        id={"session-results-see-more-btn"}
        maxHeight="27em"
        inputOrButton="button"
        buttonStyles={{
          margin: "0 auto",
          letterSpacing: "0.25em",
          fontVariant: "small-caps",
          transform: "translateY(14%)",
          minWidth: "5em",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          borderRadius: "0 0 50px 50px",
          height: "100%",
          padding: "2em 0",
        }}
        colorType="secondary"
        data=""
        size="large"
      >
        <SessionResultsRows
          questionHistory={questionHistory}
          showLoader={props.showLoader}
        />
      </CollapsibleElm>
    </div>
  );
}

export default SessionResults;
