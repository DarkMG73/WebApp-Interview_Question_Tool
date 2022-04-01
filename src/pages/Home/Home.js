import { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Home.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import CardTransparent from "../../UI/Cards/CardTransparent/CardTransparent";
import NewQuestionButton from "../../Components/NewQuestionButton/NewQuestionButton";
import Question from "../../Components/Question/Question";
import QuestionFilter from "../../Components/QuestionFilter/QuestionFilter";
import SessionResults from "../../Components/SessionResults/SessionResults";
import OutputControls from "../../Components/OutputControls/OutputControls";
import WorkArea from "../../Components/WorkArea/WorkArea";
import AddAQuestion from "../../Components/AddAQuestion/AddAQuestion";

const Home = () => {
  const questionData = useSelector((state) => state.questionData);
  const allQuestions = questionData.allQuestions;
  const filteredQuestionsIds = questionData.filteredQuestionsIds;

  useEffect(() => {
    console.log(
      "%c HOME PAGE| STATE %cline:20%cfilteredQuestionsIds",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
      filteredQuestionsIds
    );
  }, [filteredQuestionsIds]);
  useEffect(() => {
    console.log(
      "%c HOME PAGE| STATE %cline:20%allQuestions",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
      allQuestions
    );
  }, [allQuestions]);
  return (
    <div className={styles["page-wrap"]}>
      <CardSecondary>
        <QuestionFilter />
      </CardSecondary>
      <CardPrimary>
        <Question />
      </CardPrimary>
      <CardTransparent>
        <NewQuestionButton />
      </CardTransparent>
      <CardPrimary>
        <WorkArea />
      </CardPrimary>
      <CardPrimary>
        <SessionResults />
      </CardPrimary>
      <CardPrimary>
        <OutputControls />
      </CardPrimary>
      <CardSecondary>
        <AddAQuestion />
      </CardSecondary>
    </div>
  );
};

export default Home;
