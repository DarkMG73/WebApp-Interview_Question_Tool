import styles from "./QuestionFilter.module.css";
import { useSelector } from "react-redux";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { hyphenate } from "../../hooks/utility";

function QuestionFilter(props) {
  const questionMetadata = useSelector(
    (state) => state.questionData.questionMetadata
  );
  return (
    <div id="question-filter" className={styles.outerwrap}>
      Question Filter
      <div className={styles["slide-button-wrap"]}>
        <div className={styles["slide-button-inner-wrap"]}>
          <h3 className={styles["slide-button-inner-wrap-title"]}>Topics</h3>
          {questionMetadata.topic.map((topic) => {
            if (topic === "noncoding") {
              topic = hyphenate(topic, 3, "-");
            }

            return <SlideButton key={topic} label={topic} />;
          })}
        </div>
        <div className={styles["slide-button-inner-wrap"]}>
          <h3 className={styles["slide-button-inner-wrap-title"]}>Levels</h3>
          {questionMetadata.level.map((level) => {
            return <SlideButton key={level} label={level} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default QuestionFilter;
