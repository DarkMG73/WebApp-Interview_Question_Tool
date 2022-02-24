import React, { useState, useEffect } from "react";
import db from "../storage/firebase.config";

function QuestionDataFromDB() {
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    const response = db.collection("interview_questions");
    console.log("🔵 | fetchBlogs | response", response);
    const data = await response.get();
    data.docs.forEach((item) => {
      setBlogs([...blogs, item.data()]);
    });
  };
  useEffect(() => {
    fetchBlogs();
    console.log("useState", blogs);
  }, []);

  return blogs;
}

export default QuestionDataFromDB;
