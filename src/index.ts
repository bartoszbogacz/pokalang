interface PokaError {
  _type: "Error";
  value: string;
}

interface PokaScalarBoolean {
  _type: "ScalarBoolean";
  value: boolean;
}

interface PokaScalarDouble {
  _type: "ScalarDouble";
  value: number;
}

interface PokaMatrixDouble {
  _type: "MatrixDouble";
  value: MatrixDouble;
}

interface PokaScalarString {
  _type: "ScalarString";
  value: string;
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
  | PokaError
  | PokaScalarBoolean
  | PokaScalarDouble
  | PokaMatrixDouble
  | PokaScalarString
  | PokaMatrixString
  | PokaList;

interface InterpreterState {
  line: string;
  pos: number;
  stack: PokaValue[];
}

function pokaShow(value: PokaValue): string {
  if (value._type === "Error") {
    return "Error: " + value.value;
  } else if (value._type === "ScalarBoolean") {
    return value.value ? "True" : "False";
  } else if (value._type === "ScalarDouble") {
    return value.value.toString();
  } else if (value._type === "MatrixDouble") {
    return value.value.show();
  } else if (value._type === "ScalarString") {
    return '"' + value.value + '"';
  } else if (value._type === "MatrixString") {
    return value.value.show();
  } else if (value._type === "List") {
    return "[" + value.value.map(pokaShow).join(", ") + "]"
  } else {
    throw "Unreachable";
  }
}

function showInterpreterState(state: InterpreterState): string {
  const result: string[] = [];
  for (const value of state.stack.slice().reverse()) {
    result.push(pokaShow(value));
  }
  return result.join("\n");
}

function pokaMakeScalarBoolean(value: boolean): PokaScalarBoolean {
  return { _type: "ScalarBoolean", value: value };
}

function pokaMakeScalarDouble(value: number): PokaScalarDouble {
  return { _type: "ScalarDouble", value: value };
}

function pokaScalarStringMake(value: string): PokaScalarString {
  return { _type: "ScalarString", value: value };
}

function pokaMakeMatrixDouble(value: MatrixDouble): PokaMatrixDouble {
  return { _type: "MatrixDouble", value: value };
}

function pokaMakeMatrixString(value: MatrixString): PokaMatrixString {
  return { _type: "MatrixString", value: value };
}

function pokaMakeList(values: PokaValue[]): PokaList {
  return { _type: "List", value: values };
}

function pokaToRowVector(value: PokaList): PokaValue {
  const scalarsDouble: number[] = [];
  const scalarsString: string[] = [];

  for (const val of value.value) {
    if (val._type === "ScalarDouble") {
      scalarsDouble.push(val.value);
    } else if (val._type === "ScalarString") {
      scalarsString.push(val.value);
    } else {
      throw "pokaToRowVector: Error";
    }
  }

  if (scalarsDouble.length === value.value.length) {
    return pokaMakeMatrixDouble(new MatrixDouble(scalarsDouble.length, 1, scalarsDouble));
  } else if (scalarsString.length === value.value.length) {
    return pokaMakeMatrixString(new MatrixString(scalarsString.length, 1, scalarsString));
  } else {
    throw "pokaToRowVector: Error";
  }
}

function pokaToMatrix(values: PokaList): PokaValue {
  const valuesDoubleScalar: number[] = [];
  const valuesStringScalar: string[] = [];
  const valuesDoubleMatrix: MatrixDouble[] = [];
  const valuesStringMatrix: MatrixString[] = [];

  for (const value of values.value) {
    const coerced: PokaValue = value._type === "List" ? pokaToMatrix(value) : value;

    if (coerced._type === "ScalarDouble") {
      valuesDoubleScalar.push(coerced.value);
    } else if (coerced._type === "ScalarString") {
      valuesStringScalar.push(coerced.value);
    } else if (coerced._type === "MatrixDouble") {
      valuesDoubleMatrix.push(coerced.value);
    } else if (coerced._type === "MatrixString") {
      valuesStringMatrix.push(coerced.value);
    } else {
      throw "pokaToMatrix: Unsupported type: " + pokaShow(value);
    }
  }

  if (valuesDoubleScalar.length === values.value.length) {
    return pokaMakeMatrixDouble(new MatrixDouble(valuesDoubleScalar.length, 1, valuesDoubleScalar));
  } else if (valuesStringScalar.length === values.value.length) {
    return pokaMakeMatrixString(new MatrixString(valuesStringScalar.length, 1, valuesStringScalar));
  } else if (valuesDoubleMatrix.length === values.value.length) {
    return pokaMakeMatrixDouble(MatrixDouble.catRows(valuesDoubleMatrix));
  } else if (valuesStringMatrix.length === values.value.length) {
    return pokaMakeMatrixString(MatrixString.catRows(valuesStringMatrix));
  } else {
    throw "pokaToMatrix: Heterogeneous List: " + pokaShow(values);
  }
}

function pokaMakeErrorNoImplFor(
  values: PokaValue[],
  wordName: string,
): PokaError {
  return {
    _type: "Error",
    value:
      "`" +
      wordName +
      "` not implemented for: " +
      values
        .slice()
        .reverse()
        .map((v) => pokaShow(v) + "::" + v._type)
        .join(" "),
  };
}

function consumeError(state: InterpreterState, message: string): void {
  state.stack.push({ _type: "Error", value: message });
  state.pos = state.line.length;
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
    state.stack.push({
      _type: "Error",
      value: "`" + token + "` is not a number.",
    });
  } else {
    state.stack.push({ _type: "ScalarDouble", value: value });
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
      state.stack.push({ _type: "Error", value: "Unterminated string" });
      return;
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
      values.push({ _type: "Error", value: "Stack empty in fork expression" });
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
  return c >= "a" && c <= "z" || c >= "A" && c <= "Z";
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
  console.log("Identifier:", '"' + token + '"');
  const wordFun = POKA_WORDS[token];
  if (wordFun === undefined) {
    state.stack.push({
      _type: "Error",
      value: "`" + token + "` identifier unknown",
    });
  } else {
    try {
      wordFun(state.stack);
    } catch (exc) {
      state.stack.push({
        _type: "Error",
        value: "" + exc,
      });
    }
  }
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
      consumeError(state, "Expected: " + literal);
      return;
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
    consumeError(state, "Expected expression");
  }
  consumeWhitespace(state);
}

function run(line: string): InterpreterState {
  const state: InterpreterState = {
    line: line,
    pos: 0,
    stack: [],
  };

  while (!peekEOL(state)) {
    consumeExpression(state);
  }

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
