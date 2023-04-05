import { useState, useEffect } from "react";
import styles from "./QuestionFilter.module.css";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { hyphenate } from "../../Hooks/utility";
import SetFilteredQuestionIdList from "../../Hooks/SetFilteredQuestionIdList";
import { questionDataActions } from "../../store/questionDataSlice";
import { updateUserCurrentFilters } from "../../storage/userDB";
import storage from "../../storage/storage";

function QuestionFilter(props) {
  const {
    filteredQuestionsIds,
    currentFilters,
    questionHistory,
    allQuestions,
    questionMetadata,
    currentFilterStorageNeedsUpdate,
  } = useSelector((state) => state.questionData);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [refreshComponent, setRefreshComponent] = useState(1);

  useEffect(() => {
    dispatch(questionDataActions.clearQuestionFilterIds);
    const filteredQuestionIdList = SetFilteredQuestionIdList(
      allQuestions,
      currentFilters
    );
    dispatch(questionDataActions.setQuestionFilterIds(filteredQuestionIdList));
  }, [currentFilters, allQuestions, dispatch]);

  useEffect(() => {
    if (user || !user) setRefreshComponent(refreshComponent + 1);
  }, [user]);

  useEffect(() => {
    if (currentFilterStorageNeedsUpdate) {
      console.log(
        "%c --> %cline:35%ccurrentFilters",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
        currentFilters
      );
      if (user === false || user === "not logged in") {
        console.log(
          "%c --> %cline:41%cuser",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
          user
        );
        storage("ADD", { questionHistory, currentFilters });
      } else if (user) {
        updateUserCurrentFilters({ user, dataObj: currentFilters });
      }
      dispatch(questionDataActions.currentFilterStorageNeedsUpdate(false));
    }
  }, [currentFilterStorageNeedsUpdate]);

  function levelFilterButtonHandler(e) {
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
    dispatch(questionDataActions.currentFilterStorageNeedsUpdate(true));
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
    dispatch(questionDataActions.currentFilterStorageNeedsUpdate(true));
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
    dispatch(questionDataActions.currentFiltersStorageNeedsUpdate(true));
    // FilterQuestions(allQuestionsData);
  }

  let selectionsOuput;
  if (currentFilters.level.length <= 0) {
    selectionsOuput = "all levels";
  } else if (currentFilters.level.length === 1) {
    selectionsOuput = "the " + currentFilters.level[0] + " level";
  } else {
    selectionsOuput =
      "the " +
      currentFilters.level[0] +
      " and " +
      currentFilters.level[1] +
      " levels";
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
      if (topic == "noncoding") {
        topic = hyphenate(topic, 3, "-");
      }

      return topic;
    });

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
      selectionsOuput + " tagged with " + currentFilters.tags.toString();
  } else if (currentFilters.tags.length >= 1) {
    const tempArray = [...currentFilters.tags];
    const lastTag = tempArray.pop();
    selectionsOuput =
      selectionsOuput +
      " tagged with " +
      tempArray.toString() +
      " and " +
      lastTag;
  }

  return (
    <div id="question-filter" className={styles.outerwrap}>
      <h2 className="section-title">Question Filter</h2>
      <div className={styles["slide-button-wrap"]}>
        <div className={styles["slide-button-inner-wrap"]}>
          <h3
            key={currentFilterStorageNeedsUpdate}
            className={styles["slide-button-inner-wrap-title"]}
          >
            Levels
          </h3>
          {refreshComponent &&
            questionMetadata.level.map((level) => {
              return (
                <SlideButton
                  key={level}
                  label={level}
                  refresh={Math.random(10)}
                  onClick={levelFilterButtonHandler}
                  checked={currentFilters.level.includes(level)}
                />
              );
            })}
        </div>
        <div className={styles["slide-button-inner-wrap"]}>
          <h3 className={styles["slide-button-inner-wrap-title"]}>Topics</h3>
          {questionMetadata.topic.map((topic) => {
            const topicNonHyphen = topic;
            if (topic === "noncoding") {
              topic = hyphenate(topic, 3, "-");
            }

            return (
              <SlideButton
                key={topic}
                label={topic}
                onClick={topicFilterButtonHandler}
                refresh={Math.random(10)}
                checked={currentFilters.topic.includes(topicNonHyphen)}
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
                refresh={Math.random(10)}
                checked={currentFilters.tags.includes(tag)}
              />
            );
          })}
        </div>
      </div>
      <div className={styles["output-container"]}>
        <p>
          Of the {questionMetadata.identifier.length} questions, you have
          selected {filteredQuestionsIds.length} in {selectionsOuput}.
        </p>
      </div>
    </div>
  );
}

export default QuestionFilter;
