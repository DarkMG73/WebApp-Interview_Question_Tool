import styles from "./Slide-Button.module.css";

const SlideButton = (props) => {
  return (
    <div className={styles["slide-button-wrap"]}>
      <span className={styles.title}>{props.label}</span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          name={props.name}
          className={styles["switch-input"]}
        />
        <span className={styles["slider"]}></span>
      </label>
    </div>
  );
};

export default SlideButton;
