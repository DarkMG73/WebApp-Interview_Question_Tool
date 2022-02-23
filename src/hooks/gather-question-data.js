import questionHistory from "../data/questions-history.json";
import allQuestions from "../data/iq-all-questions.json";

export function gatherQuestionData() {
  const allQuestionsData = {};

  allQuestionsData.allQuestions = allQuestions;
  allQuestionsData.questionHistory = questionHistory[0];
  allQuestionsData.questionMetadata = gatherAllMetadata(allQuestions);

  console.log(
    "⚪️⚪️ | gatherQuestionData | allQuestionsData",
    allQuestionsData
  );
  return allQuestionsData;
}

function gatherAllMetadata(dataObject) {
  const itemsToInclude = ["topic", "level", "id", "tags", "credit"];

  const outputSet = objectExtractAllValuesPerKey(dataObject, itemsToInclude);

  return outputSet;
}

function objectExtractAllValuesPerKey(objectToLoop, itemsToInclude) {
  console.log("🔵 | objectExtractAllValuesPerKey | objectToLoop", objectToLoop);
  const outputObject = {};

  for (const i in objectToLoop) {
    for (let key in objectToLoop[i]) {
      key = key.trim();
      if (itemsToInclude.includes(key)) {
        const value = objectToLoop[i][key].trim().toString();
        if (outputObject.hasOwnProperty(key)) {
          outputObject[key].add(value);
        } else {
          outputObject[key] = new Set();
          outputObject[key].add(value);
        }
      }
    }
  }

  for (const i in outputObject) {
    outputObject[i] = Array.from(outputObject[i]);
  }
  return outputObject;
}
