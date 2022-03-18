import useStorage from "./storage";
import { useSelector } from "react-redux";

function useQuestionCompleted() {
  const { questionHistory, currentQuestionData } = useSelector(
    (state) => state.questionData
  );
  const storage = useStorage("add");

  return (questionHistory, currentQuestionData, storage) => {
    console.log(
      "%c --> %cline:8%cstorage",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
      storage
    );

    console.log(
      "%c --> %cline:5%cquestionHistory",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
      questionHistory
    );

    console.log(
      "%c --> %cline:5%ccurrentQuestionData",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
      currentQuestionData
    );
  };
}

export default useQuestionCompleted;
