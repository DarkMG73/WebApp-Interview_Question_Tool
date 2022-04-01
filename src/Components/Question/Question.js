import styles from "./Question.module.css";
import { useSelector, useEffect } from "react-redux";
import { numberToText } from "../../hooks/utility";
import Card from "../../UI/Cards/Card/Card";
import OptionsPanel from "../../Components/OptionsPanel/OptionsPanel";

function Question(props) {
  const currentQuestionData = useSelector(
    (state) => state.questionData.currentQuestionData
  );

  let questionText = null;
  if (currentQuestionData) questionText = currentQuestionData.title;
  return (
    <div id="question" className={styles.outerwrap}>
      <h1 className="iq-header">Question</h1>
      {!questionText && (
        <div>
          <div id="question-wrap" className="inner-wrap">
            <h2 className="question-title">How to Use this Tool</h2>
            <div id="help" className="outer-wrap">
              Using this is pretty simple. Click the "New Question" button and
              you will begin receiving questions from all difficulty levels and
              topics. If you wish to filter these, select your desired
              difficulty level, either "Basic" or "Advanced", then choose any
              combination of topics: "HTML", "CSS" or JavaScript", etc. Whatever
              combination of levels and topics you select will be used to limit
              the questions to only match that criteria.
              <br />
              <br />
              When you are finished answering the question, click the "Finished"
              button and the timer will stop. Use the buttons that appear to
              mark whether you got the question "Correct" or "Incorrect". This
              will record the question so you can review it later, if desired.
              <br />
              <br />
              If you need help along the way, you can click the "About this
              Question" button or view the answer by clicking the "Answer"
              button. The timer will not stop for either of these actions.
              <br />
              <br />
              <i>
                Note: If you do not mark the question "correct" or "Incorrect"
                it will still be recorded, but will show up on this list as
                "Unmarked", which will not be helpful for you, so make sure to
                mark each question.
                <br />
                <br />
              </i>
              The work you do here is important. This kind of practice makes a
              tremendous difference. Run through these questions over, and over,
              and over again until you feel extremely comfortable with
              absolutely everything here.
              <br />
              <br />
              <b>
                <i>Now, get going and good luck with the job search!</i>
              </b>
            </div>
          </div>
        </div>
      )}
      {questionText && (
        <div className={styles["question-text-wrap"]}>
          <h3 className={styles["question-title"]}>{questionText}</h3>
          {currentQuestionData.question && (
            <pre className={styles["question-text"]}>
              <code className={styles.code}>
                {currentQuestionData.question}
              </code>
            </pre>
          )}
        </div>
      )}
      <OptionsPanel />
    </div>
  );
}

export default Question;
