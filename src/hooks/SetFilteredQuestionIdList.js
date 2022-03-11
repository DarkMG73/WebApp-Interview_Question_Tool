function SetFilteredQuestionList(
  allQuestions,
  currentFilters,
  clearQuestionFilterIds,
  setQuestionFilterIds,
  filteredQuestionsIds
) {
  console.log(
    "%c --> %cline:5%ccurrentFilters",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
    currentFilters
  );

  let filteredQuestionIdList = [];
  const log = [];
  if (!currentFilters) return [];

  // Filter by level
  if (currentFilters.level.length > 0) {
    for (const k in allQuestions) {
      if (currentFilters.level.includes(allQuestions[k].level)) {
        filteredQuestionIdList.push(allQuestions[k].id);
        log.push({ [allQuestions[k].id]: allQuestions[k] });
      }
    }
  }
  // Filter by topic
  if (filteredQuestionIdList.length <= 0) {
    filteredQuestionIdList = Object.keys(allQuestions);
  }

  if (currentFilters.topic.length > 0) {
    const questIdsToRemove = [];
    filteredQuestionIdList.forEach((id) => {
      if (!currentFilters.topic.includes(allQuestions[id].topic)) {
        questIdsToRemove.push(allQuestions[id].id);
      } else {
        log.push({ [allQuestions[id].id]: allQuestions[id] });
      }
    });
    questIdsToRemove.forEach((id) => {
      filteredQuestionIdList.splice(filteredQuestionIdList.indexOf(id), 1);
    });
  }

  // Filter by tags
  if (filteredQuestionIdList.length <= 0)
    filteredQuestionIdList = Object.keys(allQuestions);
  if (currentFilters.tags.length > 0) {
    filteredQuestionIdList.forEach((id) => {
      if (!currentFilters.tags.includes(allQuestions[id].tags)) {
        filteredQuestionIdList.splice(
          filteredQuestionIdList.indexOf(allQuestions[id].id),
          1
        );
        log.push({ [allQuestions[id].id]: allQuestions[id] });
      }
    });
    console.log(
      "%c --> %cTAGS%cfilteredQuestionIdList",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
      filteredQuestionIdList
    );
  }

  console.log("log", log);
  return filteredQuestionIdList;
}

export default SetFilteredQuestionList;
