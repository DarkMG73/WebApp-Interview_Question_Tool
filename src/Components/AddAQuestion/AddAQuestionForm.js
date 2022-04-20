import { useState } from "react";
import styles from "./AddAQuestionForm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionFormElms from "./AddAQuestionFormElms";
import { sha256 } from "js-sha256";
import { addDocToDB } from "../../storage/firebase.config";

function AddAQuestionForm(props) {
  const [formJSX, setFormJSX] = useState([<AddAQuestionFormElms />]);
  console.log(
    "%c *****--> %cline:7%cformJSX",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
    formJSX
  );

  function addAnotherQuestionFormButtonHandler(e) {
    e.preventDefault();
    console.log("Clicked");
    setFormJSX([...formJSX, <AddAQuestionFormElms />]);
    console.log(
      "%c --> %cline:11%cformJSX",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
      formJSX
    );
  }

  function submitButtonHandler(e) {
    console.log("clicked");
    e.preventDefault();
    console.log(
      "%c --> %cline:33%ce.target",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
      e.target.parentNode
    );
    const data = new FormData(e.target.parentNode);
    const numberOfFieldsPerQuestion = 9;
    console.log(
      "%c --> %cline:49%c[...data.entries()]",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
      [...data.entries()]
    );
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
      const hasId = sha256(JSON.stringify(questions[i]));
      questionsGroomed[hasId] = questions[i];
    }
    console.log(
      "%c --> %cline:87%cquestionsGroomed",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
      questionsGroomed
    );

    // Access FormData fields with `data.get(fieldName)`
    // For example, converting to upper case
    // data.set('username', data.get('username').toUpperCase());

    // Do your Axios stuff here
    for (const key in questionsGroomed) {
      console.log(
        "%c --> %cline:84%ckey",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
        key
      );
      console.log(
        "%c --> %cline:92%cquestionsGroomed[key]",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
        questionsGroomed[key]
      );
      const theData = questionsGroomed[key];
      addDocToDB(key, theData);
      //  TODO: Clear the form
      // const formEntries = document.querySelectorAll('.form-group-wrap');
      // formEntries.forEach(item => {
      //     item.parentNode.removeChild(item);
      // })
    }
  }
  console.log(
    "%c --> %cline:11%cformJSX",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
    formJSX
  );
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
