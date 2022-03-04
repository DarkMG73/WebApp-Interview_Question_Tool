function filterQuestions(fullQuestionData) {
  const filteredQuestionIds = [];
  // const fullQuestionData = fullQuestionData;
  //   const allFilters = props.filtersObject;
  const allFilters = {
    level: ["advanced"],
    topic: ["html", "javascript"],
    tags: ["html", "javascript"],
  };

  console.log(
    "%c allFilters.level %cline:12%callFilters.level.",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
    allFilters.level
  );
  console.log(
    "%c fullQuestionData.questionMetadata.level %cline:12%callFilters.level.",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
    fullQuestionData.questionMetadata.level
  );
  console.log(
    "%c  allFilters.level.length < fullQuestionData.questionMetadata.level.length %cline:12%callFilters.level.",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
    allFilters.level.length > fullQuestionData.questionMetadata.level.length
  );
  let filteredQuestions;
  if (
    allFilters.level.length < fullQuestionData.questionMetadata.level.length
  ) {
    console.log(
      "%c IN %cline:12%callFilters.level.",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px"
    );
    filteredQuestions = applyFIlter(
      fullQuestionData.allQuestions,
      allFilters.level,
      "level"
    );
  }

  if (
    allFilters.topic.length < fullQuestionData.questionMetadata.topic.length
  ) {
    console.log(
      "%c IN %cline:12%callFilters.level.",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px"
    );

    filteredQuestions = applyFIlter(
      filteredQuestions,
      allFilters.topic,
      "topic"
    );
  }

  if (allFilters.tags.length < fullQuestionData.questionMetadata.tags.length) {
    console.log(
      "%c IN %cline:12%callFilters.level.",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px"
    );
    applyFIlter(filteredQuestions, allFilters.tags, "tags");
  }
  const filteredQuestionsIds = [];
  for (const key in filteredQuestions) {
    filteredQuestionsIds.push(filteredQuestions[key].id);
  }
  // filterArray.topic
  // filterArray.tags

  // fullQuestionList

  function applyFIlter(nestedObjectArray, filterArray, filterName) {
    console.log(
      "%c IN APPLY FILTER %cline:21%capplyFIlter",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px"
    );

    const output = nestedObjectArray.filter((questionData) => {
      // console.log(
      //   "%c IN APPLY FILTER %cline:25 questionData %capplyFIlter",
      //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //   "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
      //   questionData
      // );
      for (const k in questionData) {
        if (filterArray.includes(questionData[filterName])) {
          console.log(
            "%c IN APPLY FILTER %cline:25 filterArray.includes(questionData[filterName]) %capplyFIlter",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
            filterArray.includes(questionData[filterName])
          );
          return true;
        }
      }
      return false;
    });
    console.log(
      "%c --> %cline:93%coutput",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
      output
    );
    return output;
  }

  return filteredQuestionIds;
}

export default filterQuestions;
