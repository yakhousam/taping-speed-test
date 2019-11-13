import React, { useReducer, useEffect } from "react";
import Chart from './Chart'
import {
  Section,
  UserInput,
  TextBox,
  Main,
  ButtonReload,
  Timer
} from "./styledComponents";

import {
  setInput,
  incrementCursor,
  addError,
  removeError,
  reload,
  updateDisplayTxt,
  decTimer,
  startTimer,
  gameOver,
  updateDataChart
} from "../actions";
import { checkInput, calcAccuracy, saveResultLocalStorage } from "../utils";
import { initState } from "../store";
import reducer from "../reducer";

const MainPage = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  const {
    input,
    cursor,
    displayText,
    textArr,
    errorArr,
    timer,
    isTimerStarted,
    score,
    dataChart
  } = state;
  const handleChange = e => {
    if (timer < 1 || cursor > textArr.length - 1) {
      return;
    }
    if (!isTimerStarted && timer > 0) {
      startTimer(true, dispatch);
    }
    let input = e.target.value;
    if (!checkInput(input, textArr[cursor])) {
      if (!errorArr.includes(cursor)) {
        addError(dispatch);
      }
    } else {
      if (errorArr.includes(cursor)) {
        removeError(dispatch);
      }
    }
    if (input.endsWith(" ")) {
      incrementCursor(dispatch);
      input = "";
    }
    setInput(input, dispatch);
  };
  useEffect(() => {
    if(timer > 0){
      updateDisplayTxt(dispatch);
    }
  }, [cursor, errorArr, input, timer]);

  useEffect(() => {
    if (timer > 0 && isTimerStarted) {
      const interval = setInterval(() => {
        decTimer(dispatch);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer < 1 && isTimerStarted) {
      gameOver(dispatch);
    }
  }, [timer, isTimerStarted]);

  useEffect(() => {
    if(timer < 1 && score > 0){
    const data = saveResultLocalStorage({ score, errorArr });
    console.log("data =", data)
    updateDataChart(data, dispatch)
    }
  },[score, errorArr, timer]);

  return (
    <Main>
      <Section flexDirection='column'>
          <div>WPM: {score}</div>
          <div>Accuracy: {calcAccuracy({ score, errorArr })}</div>
          <div>ERR: {errorArr.length}</div>
        </Section>
      <Section>
        <TextBox>{displayText}</TextBox>
      </Section>
      <Section>
        <UserInput
          type="text"
          autoFocus
          value={input}
          onChange={handleChange}
        />
        {timer < 1 && (
          <ButtonReload
            onClick={() => {
              reload(dispatch);
            }}
          >
            Reload
          </ButtonReload>
        )}
        {timer > 0 && <Timer>{timer}</Timer>}
      </Section>
      
      <Chart title= "WPM" data={dataChart.map(d =>({date: d.date, value: d.score}))} />
      <Chart title= "Accuracy" data={dataChart.map(d =>({date: d.date, value: d.accuracy}))} />
    </Main>
  );
};

export default MainPage;
