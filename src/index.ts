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

interface PokaVectorBoolean {
  _type: "VectorBoolean";
  value: VectorBoolean;
}

interface PokaVectorNumber {
  _type: "VectorNumber";
  value: VectorNumber;
}

interface PokaVectorString {
  _type: "VectorString";
  value: VectorString;
}

interface PokaMatrixBoolean {
  _type: "MatrixBoolean";
  value: MatrixBoolean;
}

interface PokaMatrixNumber {
  _type: "MatrixNumber";
  value: MatrixNumber;
}

interface PokaMatrixString {
  _type: "MatrixString";
  value: MatrixString;
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
}

interface DeprecatedPokaNativeFun {
  pokaMatrixBooleanToScalarBoolean: {
    [key: string]: (a: MatrixBoolean) => boolean;
  };
  pokaMatrixStringToMatrixNumber: {
    [key: string]: (a: MatrixString) => MatrixNumber;
  };
  pokaMatrixNumberAndScalarNumberToVectorNumber: {
    [key: string]: (a: MatrixNumber, b: number) => VectorNumber;
  };
  pokaMatrixNumberToMatrixNumber: {
    [key: string]: (a: MatrixNumber) => MatrixNumber;
  };
  pokaMatrixNumberToScalarNumber: {
    [key: string]: (a: MatrixNumber) => number;
  };
  pokaScalarStringAndScalarStringToVectorString: {
    [key: string]: (a: string, b: string) => VectorString;
  };
  pokaVectorNumberToScalarNumber: {
    [key: string]: (a: VectorNumber) => number;
  };
  pokaVectorNumberToVectorNumber: {
    [key: string]: (a: VectorNumber) => VectorNumber;
  };
  pokaScalarBooleanAndScalarBooleanToScalarBoolean: {
    [key: string]: (a: boolean, b: boolean) => boolean;
  };
  pokaScalarNumberAndScalarNumberToScalarBoolean: {
    [key: string]: (a: number, b: number) => boolean;
  };
  pokaVectorStringAndScalarStringToMatrixString: {
    [key: string]: (a: VectorString, b: string) => MatrixString;
  };
  pokaVectorBooleanAndVectorBooleanToVectorBoolean: {
    [key: string]: (a: VectorBoolean, b: VectorBoolean) => VectorBoolean;
  };
  pokaVectorNumberAndVectorNumberToVectorNumber: {
    [key: string]: (a: VectorNumber, b: VectorNumber) => VectorNumber;
  };
  pokaVectorStringAndVectorStringToVectorBoolean: {
    [key: string]: (a: VectorString, b: VectorString) => VectorBoolean;
  };
  pokaMatrixNumberAndMatrixNumberToMatrixBoolean: {
    [key: string]: (a: MatrixNumber, b: MatrixNumber) => MatrixBoolean;
  };
  pokaMatrixNumberAndMatrixNumberToMatrixNumber: {
    [key: string]: (a: MatrixNumber, b: MatrixNumber) => MatrixNumber;
  };
  pokaMatrixStringAndMatrixStringToMatrixBoolean: {
    [key: string]: (a: MatrixString, b: MatrixString) => MatrixBoolean;
  };
}

interface PokaNativeFun2 {
  doc: string[];
  //
  mb_sb?: (a: MatrixBoolean) => boolean;
  mn_mn?: (a: MatrixNumber) => MatrixNumber;
  mn_sn?: (a: MatrixNumber) => number;
  ms_mn?: (a: MatrixString) => MatrixNumber;
  sn_sn?: (a: number) => number;
  ss_sn?: (a: string) => number;
  vb_sb?: (a: VectorBoolean) => boolean;
  vn_sn?: (a: VectorNumber) => number;
  vn_vn?: (a: VectorNumber) => VectorNumber;
  vs_vn?: (a: VectorString) => VectorNumber;
  //
  mn_mn_mb?: (a: MatrixNumber, b: MatrixNumber) => MatrixBoolean;
  mn_mn_mn?: (a: MatrixNumber, b: MatrixNumber) => MatrixNumber;
  mn_sn_mn?: (a: MatrixNumber, b: number) => MatrixNumber;
  mn_sn_vn?: (a: MatrixNumber, b: number) => VectorNumber;
  ms_ms_mb?: (a: MatrixString, b: MatrixString) => MatrixBoolean;
  sb_sb_sb?: (a: boolean, b: boolean) => boolean;
  sn_sn_sb?: (a: number, b: number) => boolean;
  sn_sn_sn?: (a: number, b: number) => number;
  ss_ss_sb?: (a: string, b: string) => boolean;
  ss_ss_vs?: (a: string, b: string) => VectorString;
  vb_vb_vb?: (a: VectorBoolean, b: VectorBoolean) => VectorBoolean;
  vn_vn_vb?: (a: VectorNumber, b: VectorNumber) => VectorBoolean;
  vn_vn_vn?: (a: VectorNumber, b: VectorNumber) => VectorNumber;
  vs_ss_ms?: (a: VectorString, b: string) => MatrixString;
  vs_vs_vb?: (a: VectorString, b: VectorString) => VectorBoolean;
}

function pokaShow(value: PokaValue): string {
  if (value._type === "ScalarBoolean") {
    return value.value ? "True" : "False";
  } else if (value._type === "ScalarNumber") {
    return value.value.toString();
  } else if (value._type === "ScalarString") {
    return '"' + value.value + '"';
  } else if (value._type === "VectorBoolean") {
    return pokaVectorBooleanShow(value.value);
  } else if (value._type === "VectorNumber") {
    return pokaVectorNumberShow(value.value);
  } else if (value._type === "VectorString") {
    return pokaVectorStringShow(value.value);
  } else if (value._type === "MatrixBoolean") {
    return pokaMatrixBooleanShow(value.value);
  } else if (value._type === "MatrixNumber") {
    return pokaMatrixNumberShow(value.value);
  } else if (value._type === "MatrixString") {
    return pokaMatrixStringShow(value.value);
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

function pokaMakeVectorBoolean(value: VectorBoolean): PokaVectorBoolean {
  return { _type: "VectorBoolean", value: value };
}

function pokaMakeVectorNumber(value: VectorNumber): PokaVectorNumber {
  return { _type: "VectorNumber", value: value };
}

function pokaMakeVectorString(value: VectorString): PokaVectorString {
  return { _type: "VectorString", value: value };
}

function pokaMakeMatrixBoolean(value: MatrixBoolean): PokaMatrixBoolean {
  return { _type: "MatrixBoolean", value: value };
}

function pokaMakeMatrixNumber(value: MatrixNumber): PokaMatrixNumber {
  return { _type: "MatrixNumber", value: value };
}

function pokaMakeMatrixString(value: MatrixString): PokaMatrixString {
  return { _type: "MatrixString", value: value };
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
    return pokaMakeVectorBoolean({
      _type: "VectorBoolean",
      values: valuesScalarBoolean,
    });
  } else if (valuesScalarNumber.length === value.value.length) {
    return pokaMakeVectorNumber({
      _type: "VectorNumber",
      values: valuesScalarNumber,
    });
  } else if (valuesScalarString.length === value.value.length) {
    return pokaMakeVectorString({
      _type: "VectorString",
      values: valuesScalarString,
    });
  } else {
    return value;
  }
}

function pokaTryToMatrix(value: PokaValue): PokaValue {
  if (value._type !== "List") {
    return value;
  }

  const valuesVectorBoolean: VectorBoolean[] = [];
  const valuesVectorNumber: VectorNumber[] = [];
  const valuesVectorString: VectorString[] = [];

  for (const val of value.value) {
    const coerced: PokaValue =
      val._type === "List" ? pokaTryToVector(val) : val;

    if (coerced._type === "VectorBoolean") {
      valuesVectorBoolean.push(coerced.value);
    } else if (coerced._type === "VectorNumber") {
      valuesVectorNumber.push(coerced.value);
    } else if (coerced._type === "VectorString") {
      valuesVectorString.push(coerced.value);
    } else {
      return value;
    }
  }

  if (valuesVectorBoolean.length === value.value.length) {
    return pokaMakeMatrixBoolean(pokaVectorBooleanCat(valuesVectorBoolean));
  } else if (valuesVectorNumber.length === value.value.length) {
    return pokaMakeMatrixNumber(pokaVectorNumberCat(valuesVectorNumber));
  } else if (valuesVectorString.length === value.value.length) {
    return pokaMakeMatrixString(pokaVectorStringCat(valuesVectorString));
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
  pokaDispatch2(state.stack, token);
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

function runWithInput(line: string, input: string): InterpreterState {
  const state: InterpreterState = {
    line: line,
    pos: 0,
    stack: [pokaMakeScalarString(input)],
    error: "",
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
  const state = run(text);
  preview.innerText = showInterpreterState(state);
}
