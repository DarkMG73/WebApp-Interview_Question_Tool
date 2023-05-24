import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import Footer from "../../Components/Footer/Footer";
import BottomBar from "../../Components/BottomBar/BottomBar";
import StudyNotes from "../../Components/StudyNotes/StudyNotes";
import SessionHistoryBackup from "../../Components/SessionHistoryBackup/SessionHistoryBackup";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import Timer from "../../Components/Timer/Timer";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { statusUpdateActions } from "../../store/statusUpdateSlice";

const Home = (props) => {
  const questionData = useSelector((state) => state.questionData);
  const allQuestions = questionData.allQuestions;
  const [scrollToElm, setScrollToElm] = useState(false);
  const [scrollToSessionResults, setScrollToSessionResults] = useState(false);
  const [scrollToAnswer, setScrollToAnswer] = useState(false);
  const noDBErrors = props.noDBErrors;
  const setNoDBErrors = props.setNoDBErrors;
  const dispatch = useDispatch();

  return (
    <div className={styles["page-wrap"]}>
      {!noDBErrors.status && (
        <CardSecondary>
          <p className={styles["db-error-message"]}>{noDBErrors.message}</p>
        </CardSecondary>
      )}
      {noDBErrors.status && (
        <Fragment>
          <CardSecondary>
            <ErrorBoundary>
              <LoginStatus />
            </ErrorBoundary>
          </CardSecondary>
          <CardPrimary>
            <ErrorBoundary>
              <QuestionFilter />
            </ErrorBoundary>
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
            <ErrorBoundary>
              <NewQuestionButton
                scrollToElm={scrollToElm}
                scrollToAnswer={scrollToAnswer}
              />
            </ErrorBoundary>
          </CardTransparent>
          <div id="timer-area-wrap" styles="position:relative">
            <Timer />
            <CardSecondary>
              <ErrorBoundary>
                <Question
                  setScrollToElm={setScrollToElm}
                  scrollToSessionResults={scrollToSessionResults}
                  scrollToAnswer={scrollToAnswer}
                />
              </ErrorBoundary>
            </CardSecondary>
            <CardPrimary>
              <ErrorBoundary>
                <WorkArea setScrollToAnswer={setScrollToAnswer} />
              </ErrorBoundary>
            </CardPrimary>
            <CardSecondary>
              <ErrorBoundary>
                <StudyNotes />
              </ErrorBoundary>
            </CardSecondary>
          </div>
        </Fragment>
      )}
      <CardPrimary>
        <SessionResults setScrollToSessionResults={setScrollToSessionResults} />
      </CardPrimary>
      {noDBErrors.status && (
        <Fragment>
          <CardSecondary>
            <ErrorBoundary>
              <OutputControls />
            </ErrorBoundary>
          </CardSecondary>
          <CardPrimary>
            <ErrorBoundary>
              <SessionHistoryBackup />
            </ErrorBoundary>
          </CardPrimary>
          <CardPrimary>
            <ErrorBoundary>
              <AddAQuestion />
            </ErrorBoundary>
          </CardPrimary>

          <ErrorBoundary>
            <BottomBar />
          </ErrorBoundary>
        </Fragment>
      )}{" "}
      <CardSecondary>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </CardSecondary>
    </div>
  );
};

export default Home;
