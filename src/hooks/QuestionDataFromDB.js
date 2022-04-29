import React, { useState, useEffect } from "react";
import { questionData } from "../storage/firebase.config";

function QuestionDataFromDB() {
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    const output = await questionData;
    console.log("🔵 | fetchBlogs | output", output);
    return output;
  };
  useEffect(() => {
    setBlogs(fetchBlogs());
  }, []);
  return blogs;
}

export default QuestionDataFromDB;
