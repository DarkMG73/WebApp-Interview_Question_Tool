function FilterQuestions(questionData) {
  console.log(
    "%c --> %cline:1%cprops",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
    questionData
  );

  const {
    filteredQuestionsIds,
    currentFilters,
    allQuestions,
    questionMetadata,
  } = questionData;

  const allFilters = currentFilters;

  // console.log(
  //   "%c allFilters.level %cline:12%callFilters.level.",
  //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //   "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
  //   allFilters.level
  // );
  // console.log(
  //   "%c .questionMetadata.level %cline:12%callFilters.level.",
  //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //   "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
  //   .questionMetadata.level
  // );
  // console.log(
  //   "%c  allFilters.level.length < fullQustionData.questionMetadata.level.length %cline:12%callFilters.level.",
  //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //   "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
  //   allFilters.level.length > .questionMetadata.level.length
  // );
  let filteredQuestions = allQuestions;
  if (allFilters.level.length < questionMetadata.level.length) {
    filteredQuestions = applyFIlter(
      filteredQuestions,
      allFilters.level,
      "level"
    );
  }

  if (allFilters.topic.length < questionMetadata.topic.length) {
    filteredQuestions = applyFIlter(
      filteredQuestions,
      allFilters.topic,
      "topic"
    );
  }

  if (allFilters.tags.length < questionMetadata.tags.length) {
    applyFIlter(filteredQuestions, allFilters.tags, "tags");
  }

  // Set the filter ID Array
  console.log(
    "%c --> %cline:63%cfilteredQuestionsIds",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
    filteredQuestionsIds
  );
  console.log(
    "%c --> %cline:64%cfilteredQuestions",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
    filteredQuestions
  );

  for (const key in filteredQuestions) {
    console.log(
      "%c --> %cline:66%cfilteredQuestions[key]",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
      filteredQuestions[key]
    );
    console.log(
      "%c --> %cline:68%ckey",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
      key
    );

    filteredQuestionsIds.push(filteredQuestions[key].id);
  }

  return filteredQuestionsIds;
}

export default FilterQuestions;

function applyFIlter(nestedObjectArray, filterArray, filterName) {
  const output = nestedObjectArray.filter((questionData) => {
    for (const k in questionData) {
      if (filterArray.includes(questionData[filterName])) {
        return true;
      }
    }
    return false;
  });

  return output;
}
