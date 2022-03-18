import questionHistory from "../data/questions-history.json";
import DummyQuestionData from "../data/iq-all-questions.json";
import { questionData } from "../storage/firebase.config";
import storage from "./storage";

export default async function GatherQuestionData() {
  console.log(
    "%c --> %cline:5%cGatherQuestionData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
    DummyQuestionData
  );
  const allQuestionsData = {};
  const historyDataFromStorage = storage("get");

  allQuestionsData.allQuestions = {};

  const allQuestions = [];

  // const allQuestions = await questionData;

  /////// IF USING DUMMY QUERY
  for (var i in DummyQuestionData) {
    allQuestions.push({ ...DummyQuestionData[i] });
  }
  ////////////

  console.log(
    "%c --> %cline:8%callQuestions",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
    allQuestions
  );

  allQuestions.forEach((questionData) => {
    allQuestionsData.allQuestions[questionData.id] = questionData;
  });
  allQuestionsData.questionHistory = historyDataFromStorage ?? {
    incorrect: {},
    correct: {},
    unmarked: {},
    stats: {},
  };
  allQuestionsData.questionMetadata = gatherAllMetadata(allQuestions);
  // TODO: need to have read from saved history or be empty array.
  allQuestionsData.questionHistory.stats.usedIds = [];
  allQuestionsData.currentQuestionData = {};

  console.log(
    "%c GATHER QUESTIONS OUTPUT %cline:38%callQuestionsData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
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
