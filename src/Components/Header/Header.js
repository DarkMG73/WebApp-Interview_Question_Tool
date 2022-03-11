import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import { numberToText } from "../../hooks/utility";

function Header(props) {
  const questionMetadata = useSelector(
    (state) => state.questionData.questionMetadata
  );
  // console.log(
  //   "%c --> %cline:6%cquestionMetadata",
  //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //   "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
  //   questionMetadata
  // );
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
