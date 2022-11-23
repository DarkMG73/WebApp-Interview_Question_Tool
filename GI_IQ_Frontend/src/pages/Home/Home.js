import { useState, useEffect, Fragment } from "react";
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
import Timer from "../../Components/Timer/Timer";

const Home = () => {
  const questionData = useSelector((state) => state.questionData);
  const allQuestions = questionData.allQuestions;
  const [scrollToElm, setScrollToElm] = useState(false);
  const [scrollToSessionResults, setScrollToSessionResults] = useState(false);
  const [scrollToAnswer, setScrollToAnswer] = useState(false);
  const [noDBErrors, setNoDBErrors] = useState(true);
  const [dBErrorMessage, setDbErrorMessage] = useState(false);

  useEffect(() => {
    if (
      questionData.questionMetadata.identifier.includes("errorGettingDataFromDatabase")
    ) {
      setNoDBErrors(false);
      setDbErrorMessage(allQuestions.errorGettingDataFromDatabase.question);
    }
  }, [allQuestions]);

  return (
    <div className={styles["page-wrap"]}>
      {!noDBErrors && (
        <CardSecondary>
          <p className={styles["db-error-message"]}>{dBErrorMessage}</p>
        </CardSecondary>
      )}
      {noDBErrors && (
        <Fragment>
          <CardSecondary>
            <QuestionFilter />
          </CardSecondary>
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
          <div id="timer-area-wrap" styles="position:relative">
            <Timer />
            <CardSecondary>
              <Question
                setScrollToElm={setScrollToElm}
                scrollToSessionResults={scrollToSessionResults}
                scrollToAnswer={scrollToAnswer}
              />
            </CardSecondary>
            <CardPrimary>
              <WorkArea setScrollToAnswer={setScrollToAnswer} />
            </CardPrimary>
          </div>
        </Fragment>
      )}
      <CardPrimary>
        <SessionResults setScrollToSessionResults={setScrollToSessionResults} />
      </CardPrimary>
      {noDBErrors && (
        <Fragment>
          {" "}
          <CardPrimary>
            <OutputControls />
          </CardPrimary>
          <CardSecondary>
            <AddAQuestion />
          </CardSecondary>
        </Fragment>
      )}
    </div>
  );
};

export default Home;
