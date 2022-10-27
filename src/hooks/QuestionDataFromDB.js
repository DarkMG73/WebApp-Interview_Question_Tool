import { useState, useEffect } from "react";
import { questionData } from "../storage/firebase.config";

function QuestionDataFromDB() {
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    const output = await questionData;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log("🔵 | Fetch | output", output);
  } 
   
    return output;
  };
  useEffect(() => {
    setBlogs(fetchBlogs());
  }, []);
  return blogs;
}

export default QuestionDataFromDB;
