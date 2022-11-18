import interviewQuestionSchema from "../models/interviewQuestionModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import adminList from "../data/adminList.js";

function getInterviewQuestionModelAndCollection(user) {
  let collection = user ? user._id : "all-questions";
  if (user && adminList["all-questions"].includes(user._id)) {
    collection = "all-questions";
  }
  return mongoose.model(collection, interviewQuestionSchema);
}
//getInterviewQuestions function to get all questions
export const getInterviewQuestions = asyncHandler(async (req, res) => {
  const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);
  const interviewQuestions = await InterviewQuestion.find({});
  res.json(interviewQuestions);
});

//getInterviewQuestionById function to retrieve user by id
export const getInterviewQuestionById = asyncHandler(async (req, res) => {
  const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);
  const interviewQuestion = await InterviewQuestion.findById(req.params.id);

  //if user id match param id send user else return error
  if (interviewQuestion) {
    res.json(interviewQuestion);
  } else {
    res.status(404).json({ message: "Question not found" });
    res.status(404);
    return new Error("Question not found");
  }
});

// getInterviewQuestionByHashId function to retrieve user
// by the Hash id assigned when it was created.
export const getInterviewQuestionByHashId = asyncHandler(async (req, res) => {
  const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);
  const hashId = req.params.hashId;
  const filter = { id: hashId };
  const interviewQuestion = await InterviewQuestion.findOne(filter);

  //if user id match param id send user else send error
  if (interviewQuestion) {
    res.json(interviewQuestion);
  } else {
    res.status(404).json({ message: "Question not found" });
    res.status(404);
  }
});

/// ADD A QUESTIONS ////////////////////////////
export const AddInterviewQuestion = asyncHandler(async (req, res, next) => {
  const interviewQuestion = req.body.theData;
  const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);

  if (req.user) {
    const newInterviewQuestion = new InterviewQuestion(interviewQuestion);
    newInterviewQuestion
      .save()
      .then((doc) => {
        res.json(doc);
        return;
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the question.",
          err: err,
        });
        res.status(404);
        return new Error("Error saving question.");
      });
  } else {
    return res.status(401).json({ message: "Unauthorized user 1!!" });
  }
});

/// ADD MANY QUESTIONS /////////////////////////////
export const AddManyInterviewQuestions = asyncHandler(
  async (req, res, next) => {
    console.log("Saving Multiple Questions");
    const interviewQuestion = req.body.theData;
    console.log("req.body", req.body);
    const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);

    if (req.user) {
      const newInterviewQuestion = new InterviewQuestion(interviewQuestion);
      newInterviewQuestion.collection
        .insertMany(interviewQuestion, {
          ordered: false,
        })
        .then((doc) => {
          res.json(doc);
          return;
        })
        .catch((err) => {
          console.log("err", err);
          res.status(404).json({
            message: "Error when trying to save the question.",
            err: err,
          });
          res.status(404);
        });
    } else {
      return res.status(401).json({ message: "Unauthorized user 1!!" });
    }
  }
);

/// UPDATE A QUESTION /////////////////////////////
export const UpdateInterviewQuestion = asyncHandler(async (req, res) => {
  const dataObj = req.body.dataObj;
  const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);

  // Convert strings to numbers where needed
  function groomObjectForDB(dataObj) {
    const requiresNumber = ["rating"];
    const requiresBoolean = ["oversampling", "favorite"];
    const newDataObj = {};

    const stringToBoolean = (string) => {
      switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
          return true;

        case "false":
        case "no":
        case "0":
        case null:
          return false;

        default:
          return Boolean(string);
      }
    };

    for (const key in dataObj) {
      if (requiresNumber.includes(key) && isNaN(dataObj[key])) {
        const newNumber = dataObj[key];

        newDataObj[key] = parseFloat(dataObj[key].replace('"', ""));
      } else if (requiresBoolean.includes(key)) {
        if (dataObj[key].constructor === String) {
          newDataObj[key] = stringToBoolean(dataObj[key]);
        }
      } else {
        newDataObj[key] = dataObj[key];
      }
    }

    return newDataObj;
  }

  const groomedDataObject = groomObjectForDB(dataObj);
  const dbID = groomedDataObject.dbID;
  const filter = { _id: dbID };
  const interviewQuestion = await InterviewQuestion.findOne(filter);

  if (interviewQuestion._id.toString() === dbID) {
    InterviewQuestion.findOneAndUpdate(
      filter,
      { $set: groomedDataObject },
      { new: false }
    )
      .then((doc) => {
        res.status(200).json({ message: "It worked.", doc: doc });
        res.status(200);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the question.",
          err: err,
        });
        res.status(404);
      });
  } else {
    res.status(404).json({ message: "Question not found" });
    res.status(404);
  }
});

export const RemoveInterviewQuestion = asyncHandler(async (req, res) => {
  const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);

  InterviewQuestion.deleteOne({ _id: req.params.id })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(404)
        .json({ message: "Error when trying to save the question.", err: err });
      res.status(404);
      return new Error("Error saving question.");
    });
});
export const RemoveAllInterviewQuestions = asyncHandler(async (req, res) => {
  const InterviewQuestion = getInterviewQuestionModelAndCollection(req.user);
  InterviewQuestion.deleteMany({})
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(404)
        .json({ message: "Error when trying to save the question.", err: err });
      res.status(404);
      return new Error("Error saving question.");
    });
});

export const InterviewQuestionModel = asyncHandler(async (req, res) => {
  const interviewQuestions = await interviewQuestionSchema;

  res.json({ model: interviewQuestions });
});

////////////////////////////////////////////////////////////////
///       ADMIN ACCESS
////////////////////////////////////////////////////////////////
//getAdminInterviewQuestions function to get all questions for the admin
export const getAdminInterviewQuestions = asyncHandler(async (req, res) => {
  if (!req.user) res.status(401).json({ message: "Access not authorized" });

  if (!adminList["all-questions"].includes(req.user._id))
    res
      .status(403)
      .json({ message: "Sorry, you do not have permission to access this." });
  const collection = "all-questions";
  const InterviewQuestion = mongoose.model(collection, interviewQuestionSchema);
  const interviewQuestions = await InterviewQuestion.find({});
  res.json(interviewQuestions);
});

// getInterviewQuestions function to get all questions
export const changeFieldNameInDB = asyncHandler(async (req, res) => {
  console.log("Get all questions request", req);
  const InterviewQuestion = getInterviewQuestionModelAndCollection();
  console.log("InterviewQuestion", InterviewQuestion);
  const interviewQuestions = await InterviewQuestion.update(
    { "name.additional": { $exists: true } },
    { $rename: { id: "identifier" } },
    false,
    true
  );
  console.log("******************");
  console.log("*** The DB was updated with a name change ***");
  console.log("******************");
});

// changeFieldNameInDB();
