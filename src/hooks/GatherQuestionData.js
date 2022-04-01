import questionHistory from "../data/questions-history.json";
import DummyQuestionData from "../data/iq-all-questions.json";
import { questionData } from "../storage/firebase.config";
import storage from "./storage";

export default async function GatherQuestionData() {
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

  allQuestions.forEach((questionData) => {
    const tags = [];
    if (questionData.hasOwnProperty("tags")) {
      if (questionData.tags.constructor === String) {
        questionData.tags = stringToArray(questionData.tags);
      } else if (!questionData.tags.constructor === Array) {
        console.log("ERROR: Question tags in an incorrect format");
        questionData.tags = [];
      } else {
        questionData.tags = questionData.tags.map((tag) =>
          tag.replaceAll(" ", "")
        );
      }
    } else {
      questionData.tags = [];
    }
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

  return allQuestionsData;
}

function gatherAllMetadata(dataObject) {
  const itemsToInclude = ["topic", "level", "id", "tags", "credit"];
  const valuesToExclude = ["undefined", "", " "];
  const outputSet = objectExtractAllValuesPerKey(
    dataObject,
    itemsToInclude,
    valuesToExclude
  );
  return outputSet;
}

function objectExtractAllValuesPerKey(
  objectToLoop,
  itemsToInclude,
  valuesToExclude
) {
  const outputObject = {};

  // Grab each question
  for (const i in objectToLoop) {
    // Get each item withing that questoin (ID, topic, answer, etc)
    for (let key in objectToLoop[i]) {
      key = key.trim();

      // Check if we are meant to include that item & the value is valid
      if (
        itemsToInclude.includes(key) &&
        !valuesToExclude.includes(objectToLoop[i][key])
      ) {
        // If the value is a list, separate at the comma
        if (objectToLoop[i][key].indexOf(",") >= 0) {
          const termArray = objectToLoop[i][key].split(",");

          // For each list item, put is in the Set (removes duplicates)
          termArray.forEach((term) => {
            const value = term.trim().toString();

            // Add to Set. If key Set does not exist, create it.
            if (outputObject.hasOwnProperty(key)) {
              outputObject[key].add(value);
            } else {
              outputObject[key] = new Set();
              outputObject[key].add(value);
            }
          });
        } // Since teh value is not a string list, if the value is not an array, just add it as-is to the key Set
        else if (objectToLoop[i][key].constructor !== Array) {
          const value = objectToLoop[i][key].trim().toString();

          if (outputObject.hasOwnProperty(key)) {
            outputObject[key].add(value);
          } else {
            outputObject[key] = new Set();
            outputObject[key].add(value);
          }
        } // Since the value is an array, loop to add it
        else if (objectToLoop[i][key].constructor == Array) {
          objectToLoop[i][key].forEach((rawValue) => {
            const value = rawValue.replaceAll(" ", "").toString();
            // Check if  the value is valid
            if (!valuesToExclude.includes(value)) {
              if (outputObject.hasOwnProperty(key)) {
                outputObject[key].add(value);
              } else {
                outputObject[key] = new Set();
                outputObject[key].add(value);
              }
            }
          });
        }
      }
    }
  }

  for (const i in outputObject) {
    outputObject[i] = Array.from(outputObject[i]);
  }

  for (const i in outputObject) {
  }
  return outputObject;
}

function stringToArray(tagString) {
  if (tagString == "undefined") return [];

  return tagString.replaceAll(" ", "").split(",");
}
