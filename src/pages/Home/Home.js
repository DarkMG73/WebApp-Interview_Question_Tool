import styles from "./Home.module.css";
import CardPrimary from "../../UI/Cards/Card-Primary/Card-Primary";
import CardSecondary from "../../UI/Cards/Card-Secondary/Card-Secondary";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { useSelector } from "react-redux";
import { hyphenate, numberToText } from "../../hooks/utility";
import NewQuestionButton from "../../Components/NewQuestionButton/NewQuestionButton";
import Question from "../../Components/Question/Question";
import QuestionFilter from "../../Components/QuestionFilter/QuestionFilter";
import SessionResults from "../../Components/SessionResults/SessionResults";
import OutputControls from "../../Components/OutputControls/OutputControls";
import WorkArea from "../../Components/WorkArea/WorkArea";
import AddAQuestion from "../../Components/AddAQuestion/AddAQuestion";

const Home = () => {
  const questionData = useSelector((state) => state.questionData);
  const questionMetadata = questionData.questionMetadata;
  const questionHistory = questionData.questionHistory;
  const allQuestions = questionData.allQuestions;
  return (
    <div className={styles["page-wrap"]}>
      <CardSecondary>
        <QuestionFilter />
      </CardSecondary>
      <CardPrimary>
        <Question />
      </CardPrimary>
      <CardSecondary>
        <NewQuestionButton />
      </CardSecondary>
      <CardPrimary></CardPrimary>
      <CardSecondary>
        <SessionResults />
      </CardSecondary>
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
