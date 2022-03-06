function SetFilteredQuestionList(
  allQuestions,
  currentFilters,
  clearQuestionFilterIds,
  setQuestionFilterIds
) {
  console.log(
    "%c --> %cline:5%ccurrentFilters",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
    currentFilters
  );

  const filteredQuestionIdList = [];

  // Filter by level
  for (const k in allQuestions) {
    console.log(
      "%c --> %cline:14%ccurrentFilters.level.includes(allQuestions[k].level",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
      currentFilters.level.includes(allQuestions[k].level)
    );
    if (currentFilters.level.includes(allQuestions[k].level)) {
      filteredQuestionIdList.push(allQuestions[k].id);
    }
  }

  // Filter by topic
  filteredQuestionIdList.forEach((id) => {
    if (currentFilters.topic.includes(allQuestions[id].topic)) {
      filteredQuestionIdList.push(allQuestions[id].id);
    }
  });

  // Filter by tags
  filteredQuestionIdList.forEach((id) => {
    if (currentFilters.tags.includes(allQuestions[id].tags)) {
      filteredQuestionIdList.push(allQuestions[id].id);
    }
  });

  return filteredQuestionIdList;
}

export default SetFilteredQuestionList;
