import styles from "./QuestionFilter.module.css";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { hyphenate } from "../../hooks/utility";
import filterQuestions from "../../hooks/filterQuestions";

function QuestionFilter(props) {
  const allQuestionsData = useSelector((state) => state.questionData);

  const { questionMetadata } = allQuestionsData;
  const filteredQuestions = filterQuestions(allQuestionsData);
  console.log(
    "%c --> %cline:14%cfilteredQuestions",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
    filteredQuestions
  );

  function topicFilterButtonHandler(e) {
    console.log(
      "%c topicFilterButtonHandler %cline:12%cvar",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
      e.target.value
    );
    const filteredQuestions = filterQuestions(allQuestionsData);
    console.log(
      "%c --> %cline:14%cfilteredQuestions",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
      filteredQuestions
    );
  }

  function tagsFilterButtonHandler(e) {
    console.log(
      "%c tagsFilterButtonHandler %cline:16%ctagsFilterButtonHandler",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
      e.target.value
    );
    const filteredQuestions = filterQuestions(allQuestionsData);
    console.log(
      "%c --> %cline:14%cfilteredQuestions",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
      filteredQuestions
    );
  }

  function levelFilterButtonHandler(e) {
    console.log(
      "%c levelsFilterButtonHandler %cline:21%ce",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
      e.target.value
    );
    const filteredQuestions = filterQuestions(allQuestionsData);
    console.log(
      "%c --> %cline:14%cfilteredQuestions",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
      filteredQuestions
    );
  }
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

            return (
              <SlideButton
                key={topic}
                label={topic}
                onClick={topicFilterButtonHandler}
              />
            );
          })}
        </div>
        <div className={styles["slide-button-inner-wrap"]}>
          <h3 className={styles["slide-button-inner-wrap-title"]}>Tags</h3>
          {questionMetadata.tags.map((tag) => {
            return (
              <SlideButton
                key={tag}
                label={tag}
                onClick={tagsFilterButtonHandler}
              />
            );
          })}
        </div>
        <div className={styles["slide-button-inner-wrap"]}>
          <h3 className={styles["slide-button-inner-wrap-title"]}>Levels</h3>
          {questionMetadata.level.map((level) => {
            return (
              <SlideButton
                key={level}
                label={level}
                onClick={levelFilterButtonHandler}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuestionFilter;
