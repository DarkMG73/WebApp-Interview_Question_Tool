import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import { numberToText } from "../../hooks/utility";

function Header(props) {
  const questionMetadata = useSelector(
    (state) => state.questionData.questionMetadata
  );

  return (
    <div id="iq-header" className={styles.outerwrap}>
      <h1 className="iq-header">Interview Question Tool</h1>
      <h3 className={styles["iq-subtitle"]}>
        {questionMetadata.id.length} questions |{" "}
        {numberToText(questionMetadata.level.length)} Levels |{" "}
        {numberToText(questionMetadata.topic.length)} Topics
      </h3>
    </div>
  );
}

export default Header;
