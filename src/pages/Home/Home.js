import { useState, useEffect } from "react";
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
  const [scrollToElm, setScrollToElm] = useState(false);
  const [scrollToSessionResults, setScrollToSessionResults] = useState(false);
  const [scrollToAnswer, setScrollToAnswer] = useState(false);

  useEffect(() => {}, [filteredQuestionsIds]);
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
        <Question
          setScrollToElm={setScrollToElm}
          scrollToSessionResults={scrollToSessionResults}
          scrollToAnswer={scrollToAnswer}
        />
      </CardPrimary>
      <CardTransparent
        styles={{
          top: "0",
          position: "sticky",
          zIndex: "90",
          boxShadow:
            "20px 20px 40px -30px rgb(0 0 0 / 50%), 10px 10px 30px -20px black ",
        }}
      >
        <NewQuestionButton
          scrollToElm={scrollToElm}
          scrollToAnswer={scrollToAnswer}
        />
      </CardTransparent>
      <CardPrimary>
        <WorkArea setScrollToAnswer={setScrollToAnswer} />
      </CardPrimary>
      <CardPrimary>
        <SessionResults setScrollToSessionResults={setScrollToSessionResults} />
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
