import { useEffect } from "react";
import styles from "./QuestionFilter.module.css";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { hyphenate } from "../../hooks/utility";
import FilterQuestions from "../../hooks/FilterQuestions";
import SetFilteredQuestionIdList from "../../hooks/SetFilteredQuestionIdList";
import { questionDataActions } from "../../store/questionDataSlice";

function QuestionFilter(props) {
  const allQuestionsData = useSelector((state) => state.questionData);

  const dispatch = useDispatch();
  const {
    filteredQuestionsIds,
    currentFilters,
    allQuestions,
    questionMetadata,
  } = allQuestionsData;

  // const filteredQuestions = FilterQuestions(allQuestionsData);

  useEffect(() => {
    console.log("HERE");
    dispatch(questionDataActions.clearQuestionFilterIds);
    const filteredQuestionIdList = SetFilteredQuestionIdList(
      allQuestionsData.allQuestions,
      allQuestionsData.currentFilters
    );
    dispatch(questionDataActions.setQuestionFilterIds(filteredQuestionIdList));
  }, [
    allQuestionsData.currentFilters,
    allQuestionsData.allQuestions,
    dispatch,
  ]);
  function levelFilterButtonHandler(e) {
    console.log(
      "%c --> %cline:29%ce.target",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
      e.target
    );
    if (e.target.checked) {
      dispatch(
        questionDataActions.addToQuestionFilters({
          type: "level",
          value: e.target.value,
        })
      );
      SetFilteredQuestionIdList();
    } else {
      dispatch(
        questionDataActions.removeFromQuestionFilters({
          type: "level",
          value: e.target.value,
        })
      );
    }

    // FilterQuestions(allQuestionsData);
  }

  function topicFilterButtonHandler(e) {
    if (e.target.checked) {
      dispatch(
        questionDataActions.addToQuestionFilters({
          type: "topic",
          value: e.target.value.replace(/-/g, ""),
        })
      );
    } else {
      dispatch(
        questionDataActions.removeFromQuestionFilters({
          type: "topic",
          value: e.target.value,
        })
      );
    }
    // FilterQuestions(allQuestionsData);
  }

  function tagsFilterButtonHandler(e) {
    if (e.target.checked) {
      dispatch(
        questionDataActions.addToQuestionFilters({
          type: "tags",
          value: e.target.value,
        })
      );
    } else {
      dispatch(
        questionDataActions.removeFromQuestionFilters({
          type: "tags",
          value: e.target.value,
        })
      );
    }
    // FilterQuestions(allQuestionsData);
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
