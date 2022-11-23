import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./AddAQuestionForm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionFormElms from "./AddAQuestionFormElms";
import { sha256 } from "js-sha256";
import { addDocToDB } from "../../storage/firebase.config";

function AddAQuestionForm(props) {
  const userLoggedIn = useSelector((state) => state.loginStatus.userLoggedIn);
  const [formJSX, setFormJSX] = useState([<AddAQuestionFormElms />]);

  function addAnotherQuestionFormButtonHandler(e) {
    e.preventDefault();
    setFormJSX([...formJSX, <AddAQuestionFormElms />]);
  }

  function submitButtonHandler(e) {
    e.preventDefault();

    const data = new FormData(e.target.parentNode);
    const numberOfFieldsPerQuestion = 9;

    const dataEntries = [...data.entries()];
    const questions = [];

    // Cycle through data array
    let tempID;
    dataEntries.forEach((group, i) => {
      // If i =0 or is divisible evenly by numberOfFieldsPerQuestion, set a new object id
      if (i % numberOfFieldsPerQuestion === 0) {
        // Set a temp sequential ID to be replaced with a hash later
        tempID = i / numberOfFieldsPerQuestion;
        questions[tempID] = {};
      }
      questions[tempID][group[0]] = group[1];
    });

    // Replace the temp ID's with a hash based on the question title
    const questionsGroomed = {};
    for (const i in questions) {
      const d = new Date();
      let year = d.getFullYear();
      const hasId = sha256(JSON.stringify(questions[i]));
      const newId = year + "-" + hasId;
      questionsGroomed[newId] = questions[i];
      questionsGroomed[newId].identifierentifier = newId;
    }

    // Access FormData fields with `data.get(fieldName)`
    // For example, converting to upper case
    // data.set('username', data.get('username').toUpperCase());

    // Do your Axios stuff here
    for (const key in questionsGroomed) {
      const theData = questionsGroomed[key];

      if (userLoggedIn) {
        addDocToDB(key, theData);
      } else {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject = "A New Question for the Interview Questions Tool";
        const body = `A new question is being offered: ${JSON.stringify(
          theData
        )}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${body}`
        );
      }

      //  TODO: Clear the form
      // const formEntries = document.querySelectorAll('.form-group-wrap');
      // formEntries.forEach(item => {
      //     item.parentNode.removeChild(item);
      // })
    }
  }

  return (
    <form action="" id="add-quest-form" className={styles["inner-wrap form"]}>
      <div className={styles["inner-wrap"]}>
        {formJSX.map((formElms) => formElms)}
        <PushButton
          inputOrButton="button"
          id="quest-submit-btn"
          colorType="primary"
          value="Add another Question"
          data=""
          size="small"
          onClick={addAnotherQuestionFormButtonHandler}
        >
          Add another Question
        </PushButton>
      </div>

      <PushButton
        inputOrButton="input"
        type="submit"
        id="quest-submit-btn"
        colorType="primary"
        value="Submit"
        data=""
        size="small"
        onClick={submitButtonHandler}
      >
        Submit
      </PushButton>
    </form>
  );
}
export default AddAQuestionForm;
