import {
  getInterviewQuestions,
  getInterviewQuestionById,
  getInterviewQuestionByHashId,
  AddInterviewQuestion,
  AddManyInterviewQuestions,
  UpdateInterviewQuestion,
  RemoveInterviewQuestion,
  RemoveAllInterviewQuestions,
  InterviewQuestionModel,
  getAdminInterviewQuestions,
} from "../controllers/interviewQuestionController.js";
import express from "express";
const router = express.Router();

// express router method to create route for adding an interview question
router.route("/add").post(AddInterviewQuestion);

// express router method to create route for adding an interview question
router.route("/add-many").post(AddManyInterviewQuestions);

// express router method to create route for removing an interview question
router.route("/deleteAll").get(RemoveAllInterviewQuestions);

// express router method to create route for removing an interview question
router.route("/:id/delete").get(RemoveInterviewQuestion);

// express router method to create route for updating an interview question
router.route("/update").post(UpdateInterviewQuestion);

// express router method to create route for updating an interview question
router.route("/model").get(InterviewQuestionModel);

// express router method to create route for getting all interview questions
router.route("/admin/allInterviewQuestions").get(getAdminInterviewQuestions);

// express router method to create route for getting users by id
router.route("/hash-id/:hashid").get(getInterviewQuestionByHashId);

// express router method to create route for getting users by id
router.route("/:id").get(getInterviewQuestionById);

// express router method to create route for an admin to get all tools
router.route("/").post(getInterviewQuestions);

export default router;
