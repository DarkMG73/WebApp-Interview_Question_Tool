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
          value: e.target.value.replace(/-/g, ""),
        })
      );
      SetFilteredQuestionIdList();
    } else {
      dispatch(
        questionDataActions.removeFromQuestionFilters({
          type: "level",
          value: e.target.value.replace(/-/g, ""),
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
          value: e.target.value.replace(/-/g, ""),
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
          value: e.target.value.replace(/-/g, ""),
        })
      );
    } else {
      dispatch(
        questionDataActions.removeFromQuestionFilters({
          type: "tags",
          value: e.target.value.replace(/-/g, ""),
        })
      );
    }
    // FilterQuestions(allQuestionsData);
  }

  console.log(
    "%c ______> %cline:116%ccurrentFilters.topic",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(20, 68, 106);padding:3px;border-radius:2px",
    currentFilters.topic
  );

  let selectionsOuput;
  if (currentFilters.level.length <= 0) {
    selectionsOuput = "all levels";
  } else if (currentFilters.level.length >= 1) {
    selectionsOuput = "the " + currentFilters.level[0] + "level";
  } else {
    selectionsOuput =
      "the " +
      currentFilters.level[0] +
      " and " +
      currentFilters.level[1] +
      "levels";
  }

  if (currentFilters.topic.length === 1) {
    let topic = currentFilters.topic[0];
    if (topic === "noncoding") {
      topic = hyphenate(topic, 3, "-");
    }
    selectionsOuput = selectionsOuput + " within the  " + topic + " topic";
  } else if (currentFilters.topic.length >= 1) {
    let tempArray = [...currentFilters.topic];
    tempArray = tempArray.map((topic) => {
      console.log(
        "%c --> %cline:124%ctopic",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
        topic
      );
      if (topic == "noncoding") {
        console.log(
          "%c --> %cline:132%ctopic == noncoding",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
          topic === "noncoding"
        );

        topic = hyphenate(topic, 3, "-");
      }
      console.log(
        "%c --> %cline:141%ctopic",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
        topic
      );
      return topic;
    });

    console.log(
      "%c --> %cline:123%ctempArray",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
      tempArray
    );

    const lastTopic = tempArray.pop();
    selectionsOuput =
      selectionsOuput +
      " within the " +
      tempArray.toString() +
      " and " +
      lastTopic +
      " topics";
  }

  if (currentFilters.tags.length === 1) {
    selectionsOuput =
      selectionsOuput + " with " + currentFilters.tags.toString();
  } else if (currentFilters.tags.length >= 1) {
    const tempArray = currentFilters.tags;
    const lastTag = +currentFilters.tags.pop();
    selectionsOuput =
      selectionsOuput + " with the " + tempArray.toString() + "and " + lastTag;
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
      <div className={styles["output-container"]}>
        You have {filteredQuestionsIds.length} of {questionMetadata.id.length}{" "}
        questions in {selectionsOuput}.
      </div>
    </div>
  );
}

export default QuestionFilter;
