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
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import Timer from "../../Components/Timer/Timer";
import BottomBar from "../../Components/BottomBar/BottomBar";
import StudyNotes from "../../Components/StudyNotes/StudyNotes";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import axios from "axios";
import { statusUpdateActions } from "../../store/statusUpdateSlice";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const questionData = useSelector((state) => state.questionData);
  const allQuestions = questionData.allQuestions;
  const [scrollToElm, setScrollToElm] = useState(false);
  const [scrollToSessionResults, setScrollToSessionResults] = useState(false);
  const [scrollToAnswer, setScrollToAnswer] = useState(false);
  const [noDBErrors, setNoDBErrors] = useState(true);
  const [dBErrorMessage, setDbErrorMessage] = useState(false);

  axios.interceptors.request.use(
    (request) => {
      dispatch(loadingRequestsActions.addToLoadRequest());
      return request;
    },
    (error) => {
      alert("In REQ Error");
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      const serverRateLimitRemaining = response.headers["ratelimit-remaining"];
      dispatch(loadingRequestsActions.removeFromLoadRequest());
      dispatch(
        statusUpdateActions.updateStatus({
          status: response.status,
          statusText: response.statusText,
          rateLimitRemaining: serverRateLimitRemaining,
        })
      );
      return response;
    },
    (error) => {
      const serializedError = new Set();
      // console.log("HOME---ERROR", error.response);

      dispatch(
        statusUpdateActions.updateStatus({
          status: error.response.status,
          statusText: error.response.statusText,
        })
      );
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!noDBErrors)
      dispatch(
        statusUpdateActions.updateStatus({
          status: 500,
          statusText: dBErrorMessage,
        })
      );
  }, [noDBErrors]);
  useEffect(() => {
    if (
      questionData.questionMetadata.identifier.includes(
        "errorGettingDataFromDatabase"
      )
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
          </div>
        </Fragment>
      )}
      <CardSecondary>
        <StudyNotes />
      </CardSecondary>
      <CardPrimary>
        <SessionResults setScrollToSessionResults={setScrollToSessionResults} />
      </CardPrimary>
      {noDBErrors && (
        <Fragment>
          <CardSecondary>
            <ErrorBoundary>
              <OutputControls />
            </ErrorBoundary>
          </CardSecondary>

          <CardPrimary>
            <ErrorBoundary>
              <AddAQuestion />
            </ErrorBoundary>
          </CardPrimary>
        </Fragment>
      )}
      <CardSecondary>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </CardSecondary>
      <ErrorBoundary>
        <BottomBar />
      </ErrorBoundary>
    </div>
  );
};

export default Home;
