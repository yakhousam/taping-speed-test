import {formatTxt} from './utils'

const txt = "I'm unstoppable, I'm a Porsche with no brakes";

export const initState = {
  displayText: formatTxt(txt),
  textArr: txt.split(/\s+/),
  input: "",
  errorArr: [],
  cursor: 0
};
