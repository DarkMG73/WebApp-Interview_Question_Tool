import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Timer.module.css";
import { timerActions } from "../../store/timerSlice";

function Timer() {
  const time = useSelector((state) => state.timer.time);

  const timerRunning = useSelector((state) => state.timer.timerRunning);

  const dispatch = useDispatch();

  useEffect(() => {
    let timer = null;
    if (timerRunning) {
      timer = setInterval(() => {
        dispatch(timerActions.add());
      }, 1000);
    } else if (!timerRunning && time !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerRunning, time]);

  return (
    <div id="timer-wrap" className={styles["timer-wrap"]}>
      {time}
    </div>
  );
}

export default Timer;
