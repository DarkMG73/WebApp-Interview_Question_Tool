import styles from "./AllQuestions.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import OutputControls from "../OutputControls/OutputControls";
import AddAQuestion from "../AddAQuestion/AddAQuestion";

function AllQuestions() {
  let navigate = useNavigate();
  const allQuestions = useSelector((state) => state.questionData.allQuestions);

  console.log(
    "%c --> %cline:10%callQuestions",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
    allQuestions
  );

  const allQuestionsSet = { questions: {} };
  const groupSize = 10000;
  let count = 0;
  for (const key in allQuestions) {
    allQuestionsSet.questions[key] = { ...allQuestions[key] };
    count++;
    if (count >= groupSize) break;
  }
  const returnHomeButtonHandler = () => {
    navigate("../", { replace: false });
  };
  return (
    <CardSecondary>
      <div id="all-questions-page" className={styles.outerwrap}>
        <PushButton
          inputOrButton="button"
          id="export-json-btn"
          colorType="primary"
          value="session-record"
          data-value="export-json"
          size="large"
          onClick={returnHomeButtonHandler}
          styles={{ top: 0, position: "sticky", zIndex: 90, minWidth: "33%" }}
        >
          &larr; Return to Interview Mode
        </PushButton>
        <AddAQuestion />
        <h2 class="section-title">List of All of the Questions</h2>
        <CollapsibleElm
          id={"session-results-see-more-btn"}
          maxHeight="27em"
          inputOrButton="button"
          buttonStyles={{
            margin: "0 auto",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            transform: "translateY(14%)",
            minWidth: "5em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            borderRadius: "0 0 50px 50px",
            height: "100%",
            padding: "2em 0",
          }}
          colorType="primary"
          data=""
          size="large"
        >
          <div id="all-questions">
            <SessionResultsRows
              questionHistory={allQuestionsSet}
              hideSectionTitles={true}
            />
          </div>
        </CollapsibleElm>{" "}
      </div>
      <OutputControls hideAllQuestionsListButton="true" />
    </CardSecondary>
  );
}

export default AllQuestions;
