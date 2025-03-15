interface PokaScalarBoolean {
  _type: "ScalarBoolean";
  value: boolean;
}

interface PokaScalarNumber {
  _type: "ScalarNumber";
  value: number;
}

interface PokaScalarString {
  _type: "ScalarString";
  value: string;
}

interface PokaList {
  _type: "List";
  value: PokaValue[];
}

type PokaValue =
  | PokaScalarBoolean
  | PokaScalarNumber
  | PokaScalarString
  | PokaVectorBoolean
  | PokaVectorNumber
  | PokaVectorString
  | PokaMatrixBoolean
  | PokaMatrixNumber
  | PokaMatrixString
  | PokaList;

interface InterpreterState {
  line: string;
  pos: number;
  stack: PokaValue[];
  error: string;
  env: {[word: string]: PokaValue};
}

interface DeprecatedPokaNativeFun {
  pokaMatrixBooleanToScalarBoolean: {
    [key: string]: (a: PokaMatrixBoolean) => boolean;
  };
  pokaMatrixStringToMatrixNumber: {
    [key: string]: (a: PokaMatrixString) => PokaMatrixNumber;
  };
  pokaMatrixNumberAndScalarNumberToVectorNumber: {
    [key: string]: (a: PokaMatrixNumber, b: number) => PokaVectorNumber;
  };
  pokaMatrixNumberToMatrixNumber: {
    [key: string]: (a: PokaMatrixNumber) => PokaMatrixNumber;
  };
  pokaMatrixNumberToScalarNumber: {
    [key: string]: (a: PokaMatrixNumber) => number;
  };
  pokaScalarStringAndScalarStringToVectorString: {
    [key: string]: (a: string, b: string) => PokaVectorString;
  };
  pokaVectorNumberToScalarNumber: {
    [key: string]: (a: PokaVectorNumber) => number;
  };
  pokaVectorNumberToVectorNumber: {
    [key: string]: (a: PokaVectorNumber) => PokaVectorNumber;
  };
  pokaScalarBooleanAndScalarBooleanToScalarBoolean: {
    [key: string]: (a: boolean, b: boolean) => boolean;
  };
  pokaScalarNumberAndScalarNumberToScalarBoolean: {
    [key: string]: (a: number, b: number) => boolean;
  };
  pokaVectorStringAndScalarStringToMatrixString: {
    [key: string]: (a: PokaVectorString, b: string) => PokaMatrixString;
  };
  pokaVectorBooleanAndVectorBooleanToVectorBoolean: {
    [key: string]: (
      a: PokaVectorBoolean,
      b: PokaVectorBoolean,
    ) => PokaVectorBoolean;
  };
  pokaVectorNumberAndVectorNumberToVectorNumber: {
    [key: string]: (
      a: PokaVectorNumber,
      b: PokaVectorNumber,
    ) => PokaVectorNumber;
  };
  pokaVectorStringAndVectorStringToVectorBoolean: {
    [key: string]: (
      a: PokaVectorString,
      b: PokaVectorString,
    ) => PokaVectorBoolean;
  };
  pokaMatrixNumberAndMatrixNumberToMatrixBoolean: {
    [key: string]: (
      a: PokaMatrixNumber,
      b: PokaMatrixNumber,
    ) => PokaMatrixBoolean;
  };
  pokaMatrixNumberAndMatrixNumberToMatrixNumber: {
    [key: string]: (
      a: PokaMatrixNumber,
      b: PokaMatrixNumber,
    ) => PokaMatrixNumber;
  };
  pokaMatrixStringAndMatrixStringToMatrixBoolean: {
    [key: string]: (
      a: PokaMatrixString,
      b: PokaMatrixString,
    ) => PokaMatrixBoolean;
  };
}

interface PokaNativeFun2 {
  doc: string[];
  //
  mb_sb?: (a: PokaMatrixBoolean) => boolean;
  mn_mn?: (a: PokaMatrixNumber) => PokaMatrixNumber;
  mn_sn?: (a: PokaMatrixNumber) => number;
  ms_mn?: (a: PokaMatrixString) => PokaMatrixNumber;
  sn_sn?: (a: number) => number;
  ss_sn?: (a: string) => number;
  vb_sb?: (a: PokaVectorBoolean) => boolean;
  vn_sn?: (a: PokaVectorNumber) => number;
  vn_vn?: (a: PokaVectorNumber) => PokaVectorNumber;
  vs_vn?: (a: PokaVectorString) => PokaVectorNumber;
  //
  mn_mn_mb?: (a: PokaMatrixNumber, b: PokaMatrixNumber) => PokaMatrixBoolean;
  mn_mn_mn?: (a: PokaMatrixNumber, b: PokaMatrixNumber) => PokaMatrixNumber;
  mn_sn_mn?: (a: PokaMatrixNumber, b: number) => PokaMatrixNumber;
  mn_sn_vn?: (a: PokaMatrixNumber, b: number) => PokaVectorNumber;
  ms_ms_mb?: (a: PokaMatrixString, b: PokaMatrixString) => PokaMatrixBoolean;
  sb_sb_sb?: (a: boolean, b: boolean) => boolean;
  sn_sn_sb?: (a: number, b: number) => boolean;
  sn_sn_sn?: (a: number, b: number) => number;
  ss_ss_sb?: (a: string, b: string) => boolean;
  ss_ss_vs?: (a: string, b: string) => PokaVectorString;
  vb_vb_vb?: (a: PokaVectorBoolean, b: PokaVectorBoolean) => PokaVectorBoolean;
  vn_vn_vb?: (a: PokaVectorNumber, b: PokaVectorNumber) => PokaVectorBoolean;
  vn_vn_vn?: (a: PokaVectorNumber, b: PokaVectorNumber) => PokaVectorNumber;
  vs_ss_ms?: (a: PokaVectorString, b: string) => PokaMatrixString;
  vs_vs_vb?: (a: PokaVectorString, b: PokaVectorString) => PokaVectorBoolean;
}

function pokaShow(value: PokaValue): string {
  if (value._type === "ScalarBoolean") {
    return value.value ? "True" : "False";
  } else if (value._type === "ScalarNumber") {
    return value.value.toString();
  } else if (value._type === "ScalarString") {
    return '"' + value.value + '"';
  } else if (value._type === "PokaVectorBoolean") {
    return pokaVectorBooleanShow(value);
  } else if (value._type === "PokaVectorNumber") {
    return pokaVectorNumberShow(value);
  } else if (value._type === "PokaVectorString") {
    return pokaVectorStringShow(value);
  } else if (value._type === "PokaMatrixBoolean") {
    return pokaMatrixBooleanShow(value);
  } else if (value._type === "PokaMatrixNumber") {
    return pokaMatrixNumberShow(value);
  } else if (value._type === "PokaMatrixString") {
    return pokaMatrixStringShow(value);
  } else if (value._type === "List") {
    return "[" + value.value.map(pokaShow).join(", ") + "]";
  } else {
    throw "Unreachable";
  }
}

function showInterpreterState(state: InterpreterState): string {
  const result: string[] = [];
  for (const value of state.stack.slice().reverse()) {
    result.push(pokaShow(value));
  }
  return state.error + "\n" + result.join("\n");
}

function pokaMakeScalarBoolean(value: boolean): PokaScalarBoolean {
  return { _type: "ScalarBoolean", value: value };
}

function pokaMakeScalarNumber(value: number): PokaScalarNumber {
  return { _type: "ScalarNumber", value: value };
}

function pokaMakeScalarString(value: string): PokaScalarString {
  return { _type: "ScalarString", value: value };
}

function pokaMakeList(values: PokaValue[]): PokaList {
  return { _type: "List", value: values };
}

function pokaTryToVector(value: PokaValue): PokaValue {
  if (value._type !== "List") {
    return value;
  }

  const valuesScalarBoolean: boolean[] = [];
  const valuesScalarNumber: number[] = [];
  const valuesScalarString: string[] = [];

  for (const val of value.value) {
    if (val._type === "ScalarBoolean") {
      valuesScalarBoolean.push(val.value);
    } else if (val._type === "ScalarNumber") {
      valuesScalarNumber.push(val.value);
    } else if (val._type === "ScalarString") {
      valuesScalarString.push(val.value);
    } else {
      return value;
    }
  }

  if (valuesScalarBoolean.length === value.value.length) {
    return {
      _type: "PokaVectorBoolean",
      values: valuesScalarBoolean,
    };
  } else if (valuesScalarNumber.length === value.value.length) {
    return {
      _type: "PokaVectorNumber",
      values: valuesScalarNumber,
    };
  } else if (valuesScalarString.length === value.value.length) {
    return {
      _type: "PokaVectorString",
      values: valuesScalarString,
    };
  } else {
    return value;
  }
}

function pokaTryToMatrix(value: PokaValue): PokaValue {
  if (value._type !== "List") {
    return value;
  }

  const valuesVectorBoolean: PokaVectorBoolean[] = [];
  const valuesVectorNumber: PokaVectorNumber[] = [];
  const valuesVectorString: PokaVectorString[] = [];

  for (const val of value.value) {
    const coerced: PokaValue =
      val._type === "List" ? pokaTryToVector(val) : val;

    if (coerced._type === "PokaVectorBoolean") {
      valuesVectorBoolean.push(coerced);
    } else if (coerced._type === "PokaVectorNumber") {
      valuesVectorNumber.push(coerced);
    } else if (coerced._type === "PokaVectorString") {
      valuesVectorString.push(coerced);
    } else {
      return value;
    }
  }

  if (valuesVectorBoolean.length === value.value.length) {
    return pokaVectorBooleanCat(valuesVectorBoolean);
  } else if (valuesVectorNumber.length === value.value.length) {
    return pokaVectorNumberCat(valuesVectorNumber);
  } else if (valuesVectorString.length === value.value.length) {
    return pokaVectorStringCat(valuesVectorString);
  } else {
    return value;
  }
}

function peekNumber(state: InterpreterState): boolean {
  const c = state.line.charAt(state.pos);
  return c === "-" || (c >= "0" && c <= "9");
}

function consumeNumber(state: InterpreterState): void {
  const start = state.pos;
  while (true) {
    const c = state.line.charAt(state.pos);
    if (c === "-" || (c >= "0" && c <= "9")) {
      state.pos++;
    } else {
      break;
    }
  }
  if (state.line.charAt(state.pos) === ".") {
    state.pos++;
    while (true) {
      const c = state.line.charAt(state.pos);
      if (c >= "0" && c <= "9") {
        state.pos++;
      } else {
        break;
      }
    }
  }
  if (start === state.pos) {
    throw "Expected number";
  }
  const token = state.line.slice(start, state.pos);
  const value = parseFloat(token);
  if (isNaN(value)) {
    throw "`" + token + "` is not a number.";
  } else {
    state.stack.push({ _type: "ScalarNumber", value: value });
  }
}

function peekString(state: InterpreterState): boolean {
  return state.line.charAt(state.pos) === '"';
}

function consumeString(state: InterpreterState): void {
  if (state.line.charAt(state.pos) !== '"') {
    throw "Expected starting quote for string";
  }
  state.pos++;
  const start = state.pos;
  while (state.line.charAt(state.pos) !== '"') {
    if (state.pos >= state.line.length) {
      throw "Unterminated string";
    }
    state.pos++;
  }
  const token = state.line.slice(start, state.pos);
  state.pos++; // Skip closing quote
  console.log("String:", token);
  state.stack.push({ _type: "ScalarString", value: token });
}

function peekList(state: InterpreterState): boolean {
  return peekLiteral(state, "[");
}

function consumeList(state: InterpreterState): void {
  const values: PokaValue[] = [];
  const origStack = state.stack;

  consumeLiteral(state, "[");
  while (!peekLiteral(state, "]") && !peekEOL(state)) {
    state.stack = origStack.slice();
    while (!peekLiteral(state, "]") && !peekEOL(state)) {
      if (peekLiteral(state, ",")) {
        consumeLiteral(state, ",");
        break;
      }
      consumeExpression(state);
    }
    const value = state.stack.pop();
    if (value === undefined) {
      throw "Stack empty in fork expression";
    } else {
      values.push(value);
    }
  }
  consumeLiteral(state, "]");

  state.stack = origStack;

  state.stack.push(pokaMakeList(values));
}

function peekIdentifier(state: InterpreterState): boolean {
  const c = state.line.charAt(state.pos);
  return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
}

function consumeIdentifer(state: InterpreterState): void {
  const start = state.pos;
  while (true) {
    const c = state.line.charAt(state.pos);
    if (
      (c >= "a" && c <= "z") ||
      (c >= "A" && c <= "Z") ||
      (c >= "0" && c <= "9")
    ) {
      state.pos++;
    } else {
      break;
    }
  }
  if (start === state.pos) {
    throw "Expected identifier";
  }
  const token = state.line.slice(start, state.pos);
  pokaDispatch2(state.env, state.stack, token);
}

function peekLiteral(state: InterpreterState, literal: string): boolean {
  for (let i = 0; i < literal.length; i++) {
    const c = state.line.charAt(state.pos + i);
    if (c !== literal.charAt(i)) {
      return false;
    }
  }
  return true;
}

function consumeLiteral(state: InterpreterState, literal: string): void {
  for (let i = 0; i < literal.length; i++) {
    const c = state.line.charAt(state.pos++);
    if (c !== literal.charAt(i)) {
      throw "Expected: " + literal;
    }
  }
  console.log("Literal: " + literal);
}

function consumeWhitespace(state: InterpreterState): void {
  while (state.line.charAt(state.pos) === " ") {
    state.pos++;
  }
  console.log("Whitespace");
}

function peekEOL(state: InterpreterState): boolean {
  return state.pos >= state.line.length;
}

function consumeExpression(state: InterpreterState): void {
  consumeWhitespace(state);
  if (peekIdentifier(state)) {
    consumeIdentifer(state);
  } else if (peekNumber(state)) {
    consumeNumber(state);
  } else if (peekString(state)) {
    consumeString(state);
  } else if (peekList(state)) {
    consumeList(state);
  } else {
    throw "Expected expression";
  }
  consumeWhitespace(state);
}

function run(line: string): InterpreterState {
  const state: InterpreterState = {
    line: line,
    pos: 0,
    stack: [],
    error: "",
    env: {},
  };

  let error: string = "";
  try {
    while (!peekEOL(state)) {
      consumeExpression(state);
    }
  } catch (exc) {
    error = "" + exc;
  }

  state.error = error;

  return state;
}

function runWithEnvironment(line: string, environment: {[word: string]: PokaValue}): InterpreterState {
  const state: InterpreterState = {
    line: line.replace("\\n", "\n"),
    pos: 0,
    stack: [],
    error: "",
    env: {},
  };

  for (const [word, value] of Object.entries(environment)) {
    state.env[word] = value;
  }

  let error: string = "";
  try {
    while (!peekEOL(state)) {
      consumeExpression(state);
    }
  } catch (exc) {
    error = "" + exc;
  }

  state.error = error;

  return state;
}

function onInput(ev: InputEvent) {
  const target = ev.target;
  if (!(target instanceof HTMLInputElement)) {
    throw "target is: " + target;
  }
  const preview = document.getElementById("output_preview");
  if (preview === undefined || !(preview instanceof HTMLDivElement)) {
    throw "No preview";
  }
  const text = target.value;
  const env: {[word: string]: PokaValue} = {};
  for (const [_, day] of Object.entries(AOC2025)) {
    env[day.input_name] = pokaMakeScalarString(day.input_text);
  }
  const state = runWithEnvironment(text, env);
  preview.innerText = showInterpreterState(state);
}
