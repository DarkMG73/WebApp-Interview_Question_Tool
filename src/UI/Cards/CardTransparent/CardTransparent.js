import styles from "./CardTransparent.module.css";
import cardStyles from "../Card/Card.module.css";

const CardSecondary = (props) => {
  return (
    <div className={styles.header + " " + cardStyles.card}>
      {props.children}
    </div>
  );
};

export default CardSecondary;
