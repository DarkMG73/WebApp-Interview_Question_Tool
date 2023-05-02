import { questionData } from "../storage/interviewQuestionsDB.js";
import storage from "../storage/storage";

export default async function GatherQuestionData(user) {
  let allQuestionsData = {};

  //////// Get USer'S Question Data
  let userQuestionData = {};
  if (user) {
    userQuestionData = user;
  } else {
    const dataFromStorage = storage("GET");
    userQuestionData = dataFromStorage ? dataFromStorage : {};
  }
  allQuestionsData.questionHistory = userQuestionData.hasOwnProperty(
    "questionHistory"
  )
    ? { ...userQuestionData.questionHistory }
    : {
        incorrect: {},
        correct: {},
        unmarked: {},
        stats: {},
      };
  allQuestionsData.currentFilters = userQuestionData.hasOwnProperty(
    "currentFilters"
  )
    ? userQuestionData.currentFilters
    : {
        level: [],
        topic: [],
        tags: [],
      };
  allQuestionsData.studyNotes = userQuestionData.hasOwnProperty("studyNotes")
    ? userQuestionData.studyNotes
    : {
        studyTopicsIDs: [],
        notePad: "Notes\n\n",
        rowNotes: "Row Notes\n\n",
      };

  // Make sure all needed items are present.
  if (!allQuestionsData.questionHistory.hasOwnProperty("incorrect"))
    allQuestionsData.questionHistory.incorrect = {};
  if (!allQuestionsData.questionHistory.hasOwnProperty("correct"))
    allQuestionsData.questionHistory.correct = {};
  if (!allQuestionsData.questionHistory.hasOwnProperty("unmarked"))
    allQuestionsData.questionHistory.unmarked = {};
  if (!allQuestionsData.questionHistory.hasOwnProperty("stats"))
    allQuestionsData.questionHistory.stats = {};
  if (!allQuestionsData.questionHistory.hasOwnProperty("questionPersonalNotes"))
    allQuestionsData.questionHistory.questionPersonalNotes = {};

  allQuestionsData.allQuestions = {};

  let allQuestions = await questionData();

  if (allQuestions.length <= 0)
    allQuestions = [
      {
        title: "*** Error getting questions from the database. ***",
        question:
          "***Error getting questions from the database. Make sure you are connected to the internet and refresh the page. If the problem continues, please contact the site administrator. ***",
        link: "*** Error getting data ***",
        answer:
          "***Error getting questions from the database. Make sure you are connected to the internet and refresh the page. If the problem continues, please contact the site administrator. ***",
        level: "*** Error Getting Levels Data ***",
        topic: "*** Error Getting Topics Data ***",
        tags: ["*** Error Getting Tags Data ***"],
        credit: "***",
        id: "errorGettingDataFromDatabase",
        identifier: "errorGettingDataFromDatabase",
        search: "***",
      },
    ];

  // if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  //   console.log(
  //     "%callQuestions (unfiltered): ",
  //     "color:#289435;background:#2894353b;padding:5px;border-radius:0 25px 25px 0",
  //     allQuestions
  //   );
  // }

  /////// IF USING DUMMY QUERY
  // const allQuestions = [];
  // for (var i in DummyQuestionData) {
  //   allQuestions.push({ ...DummyQuestionData[i] });
  // }
  ////////////

  allQuestions.forEach((questionData) => {
    const tags = [];
    if (questionData.hasOwnProperty("tags")) {
      if (questionData.tags.constructor === String) {
        questionData.tags = stringToArray(questionData.tags);
      } else if (!questionData.tags.constructor === Array) {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
          console.log(
            "%cERROR: The question tags with incorrect format. questionData.tags = []:",
            "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
            (questionData.tags = [])
          );
      } else {
        questionData.tags = questionData.tags.map((tag) =>
          tag.replaceAll(" ", "")
        );
      }
    } else {
      questionData.tags = [];
    }

    allQuestionsData.allQuestions[questionData.identifier] = questionData;
  });

  allQuestionsData.questionMetadata = gatherAllMetadata(allQuestions);

  if (!allQuestionsData.questionHistory.stats.hasOwnProperty("usedIds"))
    allQuestionsData.questionHistory.stats.usedIds = [];

  allQuestionsData.currentQuestionData = {};

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    console.log(
      "%callQuestionsData (compiled and sorted): ",
      "color:#fff;background:#289435;padding:5px;border-radius:0 25px 25px 0",
      allQuestionsData
    );
  }

  return allQuestionsData;
}

function gatherAllMetadata(dataObject) {
  const itemsToInclude = [
    "topic",
    "level",
    "identifier",
    "tags",
    "credit",
    "_id",
  ];
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
    // Get each item withing that question (ID, topic, answer, etc)
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
        } // Since the value is not a string list, if the value is not an array, just add it as-is to the key Set
        else if (objectToLoop[i][key].constructor !== Array) {
          const value = objectToLoop[i][key].trim().toString();

          if (outputObject.hasOwnProperty(key)) {
            outputObject[key].add(value);
          } else {
            outputObject[key] = new Set();
            outputObject[key].add(value);
          }
        } // Since the value is an array, loop to add it
        else if (objectToLoop[i][key].constructor === Array) {
          if (
            objectToLoop[i][key].length > 0 ||
            objectToLoop[i][key].size > 0
          ) {
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
          } else {
            // If the above does not app;y, return a Set() if it si not already there.
            if (!outputObject.hasOwnProperty(key))
              outputObject[key] = new Set();
          }
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
