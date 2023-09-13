const download = require("image-downloader");
const path = require("path");
const allQuestionsList = require("../data/allQuestionsList.json");
const interviewQuestionSchema = require("../models/interviewQuestionModel.js");
const mongoose = require("mongoose");

// const options = {
//   url:
//     "https://www.delamar.de/wp-content/uploads/2019/01/brainworx_spl_iron.jpg",
//   dest: "/", // will be saved to /path/to/dest/image.jpg
// };
// download
//   .image(options)
//   .then(({ filename }) => {
//     console.log("------> line:9%cfilename", filename);
//     console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
//   })
//   .catch((err) => console.error(err));

module.exports.downloadPicsFromDbPhotoURL = (req, res) => {
  // console.log("IN");
  // download
  //   .image(options)
  //   .then(({ filename }) => {
  //     console.log("------> line:9%cfilename", filename);
  //     console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
  //   })
  //   .catch((err) => console.error(err));
};

/// BULK LOAD QUESTIONS TO DB ///////////////////
const loadQuestionsToDatabase = (questionsToAdd, DBName) => {
  const questionsToAddArray = Object.keys(questionsToAdd).map(
    (key) => questionsToAdd[key]
  );
  console.log("questionsToAddArray", questionsToAddArray.length);
  console.log("ADMIN: Saving Bulk Questions to DataBase");
  const InterviewQuestion = mongoose.model(DBName, interviewQuestionSchema);

  const newInterviewQuestion = new InterviewQuestion(questionsToAddArray);
  newInterviewQuestion.collection
    .insertMany(questionsToAddArray, {
      ordered: true,
    })
    .then((doc) => {
      console.log("ADMIN: Saving Bulk was SUCCESSFUL");
    })
    .catch((err) => {
      console.log("ADMIN: Saving Bulk err", err);
    });
};

// loadQuestionsToDatabase(allQuestionsList, "all-questions")
