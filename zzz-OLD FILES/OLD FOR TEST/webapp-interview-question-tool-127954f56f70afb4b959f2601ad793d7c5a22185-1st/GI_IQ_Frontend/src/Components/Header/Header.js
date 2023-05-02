import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import { numberToText } from "../../hooks/utility";
import { ReactComponent as BrainLogo } from "../../assets/images/brain-logo.svg";

function Header(props) {
  const questionMetadata = useSelector(
    (state) => state.questionData.questionMetadata
  );

  return (
    <div id="iq-header" className={styles.outerwrap}>
      <div className={styles["logo-wrap"]}>
        <BrainLogo />
      </div>
      <div className={styles["title-wrap"]}>
        <h1 className={styles["iq-title"]}>Interview Questions Tool</h1>
        <h3 className={styles["iq-subtitle"]}>
          {questionMetadata.identifier.length} questions |{" "}
          {numberToText(questionMetadata.level.length)} Levels |{" "}
          {numberToText(questionMetadata.topic.length)} Topics
        </h3>
      </div>
    </div>
  );
}

export default Header;
