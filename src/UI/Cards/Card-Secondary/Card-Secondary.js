import styles from "./Card-Secondary.module.css";

const CardSecondary = (props) => {
  return <div className={styles.header}>{props.children}</div>;
};

export default CardSecondary;
