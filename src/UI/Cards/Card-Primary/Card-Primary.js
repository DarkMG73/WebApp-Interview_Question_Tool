import styles from "./Card-Primary.module.css";
const CardPrimary = (props) => {
  return <div className={styles.header}>{props.children}</div>;
};

export default CardPrimary;
