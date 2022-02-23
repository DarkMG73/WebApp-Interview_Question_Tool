import { useSelector } from "react-redux";
import styles from "./OutputControls.module.css";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { hyphenate } from "../../hooks/utility";

function OutputControls(props) {
  const currentQuestionData = useSelector((state) => state.questionData);
  return (
    <div id="output-controls" className={styles.outerwrap}>
      <h3>OutputControls</h3>
      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
        <button
          id="export-cvs-btn"
          className={`${styles["wide-btn"]} 
          ${styles["button"]} `}
          data-value="export-cvs"
        >
          Export CVS
        </button>
        <button
          id="export-json-btn"
          className={`${styles["wide-btn"]} 
          ${styles["button"]} `}
          data-value="export-json"
        >
          Export JSON
        </button>
        <a
          id="all-quest-link"
          className={`${styles["wide-btn"]} 
            ${styles["button"]} 
           ${styles["link-all-quests-page"]}`}
          href="https://www.glassinteractive.com/interview-questions-list/"
          data-value="link-all-quests-page"
        >
          All Questions List
        </a>
      </div>
    </div>
  );
}

export default OutputControls;
