import mongoose from "mongoose";

const interviewQuestionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    answer: {
      type: String,
      required: true,
    },
    question: {
      type: String,
    },
    id: {
      type: String,
    },
    credit: {
      type: String,
    },
    level: {
      type: String,
    },
    link: {
      type: String,
    },
    search: {
      type: String,
    },
    tags: {
      type: String,
    },
    topic: {
      type: String,
    },
    notes: {
      type: String,
    },
    identifier: {
      type: String,
    },
    masterLibraryID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default interviewQuestionSchema;
