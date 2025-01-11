interface PokaError {
  _type: "Error";
  value: string;
}

interface PokaDoubleScalar {
  _type: "DoubleScalar";
  value: number;
}

interface PokaDoubleVector {
  _type: "DoubleVector";
  value: DoubleVector;
}

interface PokaStringScalar {
  _type: "StringScalar";
  value: string;
}

interface PokaStringVector {
  _type: "StringVector";
  value: StringVector;
}

type PokaValue =
  | PokaError
  | PokaDoubleScalar
  | PokaDoubleVector
  | PokaStringScalar
  | PokaStringVector;

interface InterpreterState {
  line: string;
  pos: number;
  stack: PokaValue[];
}

function showValue(value: PokaValue): string {
  if (value._type === "Error") {
    return "Error: " + value.value;
  } else if (value._type === "DoubleScalar") {
    return value.value.toString();
  } else if (value._type === "DoubleVector") {
    return doubleVectorShow(value.value);
  } else if (value._type === "StringScalar") {
    return '"' + value.value + '"';
  } else if (value._type === "StringVector") {
    return stringVectorShow(value.value);
  } else {
    throw "Unreachable";
  }
}

function showInterpreterState(state: InterpreterState): string {
  const result: string[] = [];
  for (const value of state.stack.slice().reverse()) {
    result.push(showValue(value));
  }
  return result.join("\n");
}

function pokaMakeDoubleScalar(value: number): PokaDoubleScalar {
  return { _type: "DoubleScalar", value: value};
}

function pokaStringScalarMake(value: string): PokaStringScalar {
  return { _type: "StringScalar", value: value};
}

function pokaMakeDoubleVector(value: DoubleVector): PokaDoubleVector {
  return { _type: "DoubleVector", value: value };
}

function pokaMakeStringVector(value: StringVector): PokaStringVector {
  return { _type: "StringVector", value: value };
}

function pokaMakeErrorNoImplFor(values: PokaValue[], wordName: string): PokaError {
  return {
    _type: "Error",
    value: "`" +
      wordName +
      "` not implemented for: " +
      values
        .slice()
        .reverse()
        .map((v) => showValue(v) + "::" + v._type)
        .join(" ")
  }
}

function pokaWord2(wordFun: (a: PokaValue, b: PokaValue) => PokaValue): (stack: PokaValue[]) => void {
  return function(stack: PokaValue[]): void {
    const a = stack.pop();
    if (a === undefined) {
      throw "Two arguments required";
    }
    const b = stack.pop();
    if (b === undefined) {
      throw "Two arguments required";
    }
    stack.push(wordFun(a, b));
  }
}


function consumeError(state: InterpreterState, message: string): void {
  state.stack.push({ _type: "Error", value: message });
  state.pos = state.line.length;
}

function peekNumber(state: InterpreterState): boolean {
  const c = state.line.charAt(state.pos);
  return c === "-" || c >= "0" && c <= "9";
}

function consumeNumber(state: InterpreterState): void {
  const start = state.pos;
  while (true) {
    const c = state.line.charAt(state.pos);
    if (c === "-" || c >= "0" && c <= "9") {
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
    state.stack.push({ _type: "DoubleScalar", value: value });
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
  state.stack.push({ _type: "StringScalar", value: token });
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
      values.push({_type: "Error", value: "Stack empty in fork expression"});
    } else {
      values.push(value);
    }
  }
  consumeLiteral(state, "]");

  state.stack = origStack;

  const valuesError: PokaValue[] = [];
  const valuesDoubleScalar: number[] = [];
  const valuesDoubleVector: DoubleVector[] = [];
  const valuesStringScalar: string[] = [];
  const valuesStringVector: StringVector[] = [];

  for (const value of values) {
    if (value._type === "DoubleScalar") {
      valuesDoubleScalar.push(value.value);
    } else if (value._type === "DoubleVector") {
      valuesDoubleVector.push(value.value);
    } else if (value._type === "StringScalar") {
      valuesStringScalar.push(value.value);
    } else if (value._type === "StringVector") {
      valuesStringVector.push(value.value);
    } else if (value._type === "Error") {
      valuesError.push(value);
    } else {
      throw "Unreachable";
    }
  }

  if (valuesDoubleScalar.length === values.length - valuesError.length) {
    state.stack.push(pokaMakeDoubleVector(doubleVectorMake(valuesDoubleScalar)));
  } else if (valuesDoubleVector.length === values.length - valuesError.length) {
    state.stack.push(pokaMakeDoubleVector(doubleVectorConcatenate(valuesDoubleVector)));
  } else if (valuesStringScalar.length === values.length - valuesError.length) {
    state.stack.push(pokaMakeStringVector(stringVectorMake(valuesStringScalar)));
  } else {
    state.stack.push({ _type: "Error", value: "Inhomogenous vector" });
  }

  for (const err of valuesError) {
    state.stack.push(err);
  }
}

function peekIdentifier(state: InterpreterState): boolean {
  const c = state.line.charAt(state.pos);
  return c >= "a" && c <= "z";
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
