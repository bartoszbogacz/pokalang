interface PokaList {
  _type: "List";
  value: PokaValue[];
}

interface PokaRecordEntry {
  _type: "RecordEntry";
  key: string;
  value: PokaValue;
}

interface PokaRecord {
  _type: "PokaRecord";
  value: { [key: string]: PokaValue };
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
  | PokaList
  | PokaRecordEntry
  | PokaRecord;

interface InterpreterState {
  line: string;
  pos: number;
  stack: PokaValue[];
  error: string;
  env: { [word: string]: PokaValue };
}

interface PokaWord4 {
  doc: string[];
  fun: (stack: PokaValue[]) => void;
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
  } else if (value._type === "RecordEntry") {
    return ":" + value.key + " " + pokaShow(value.value);
  } else if (value._type === "PokaRecord") {
    const asList = pokaListTryFrom(value);
    if (asList === null) {
      throw "Unreachable";
    }
    return pokaShow(asList);
  } else {
    throw "Unreachable";
  }
}

function pokaInterpreterShow(state: InterpreterState): string {
  const result: string[] = [];
  for (const value of state.stack.slice().reverse()) {
    result.push(pokaShow(value));
  }
  return state.error + "\n" + result.join("\n");
}

function pokaTryToVector(value: PokaValue): PokaValue {
  if (value._type !== "List") {
    return value;
  }
  if (value.value.length === 0) {
    // FIXME
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
    state.stack.push(pokaScalarNumberMake(value));
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
  const value = token.replace(/\\n/g, "\n");
  state.stack.push(pokaScalarStringMake(value));
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

  state.stack.push(pokaListMake(values));
}

function peekIdentifier(state: InterpreterState): boolean {
  const c = state.line.charAt(state.pos);
  return (
    c === "$" || c === "=" || (c >= "a" && c <= "z") || (c >= "A" && c <= "Z")
  );
}

function consumeIdentifer(state: InterpreterState): void {
  const start = state.pos;

  if (peekIdentifier(state)) {
    state.pos++;
  } else {
    throw "Expected identifier";
  }

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

  // Variables may only be literals, never expressions.
  // That allows discovery of all input dependencies
  // and outputs of a function by simple lexical analysis.
  // Thus variables and their environment must remain
  // "second-class".
  if (token.startsWith("$")) {
    const variableName = token.slice(1, token.length);
    const value = state.env[variableName];
    if (value === undefined) {
      throw "No such variable: " + variableName;
    }
    state.stack.push(value);
  } else if (token.startsWith("=")) {
    const variableName = token.slice(1, token.length);
    const value = state.stack.pop();
    if (value === undefined) {
      throw "Stack underflow";
    }
    state.env[variableName] = value;
  } else {
    const word = POKA_WORDS4[token];

    if (word === undefined) {
      throw "No such function: " + token;
    }

    word.fun(state.stack);
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
      throw "Expected: " + literal;
    }
  }
}

function peekWhitespace(state: InterpreterState): boolean {
  return state.line.charAt(state.pos) === " ";
}

function consumeWhitespace(state: InterpreterState): void {
  while (state.line.charAt(state.pos) === " ") {
    state.pos++;
  }
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

function pokaInterpreterMake(
  line: string,
  environment: { [word: string]: PokaValue },
): InterpreterState {
  const state: InterpreterState = {
    line: line,
    pos: 0,
    stack: [],
    error: "",
    env: {},
  };

  for (const [word, value] of Object.entries(environment)) {
    state.env[word] = value;
  }

  return state;
}

function pokaInterpreterEvaluate(state: InterpreterState): void {
  let error: string = "";
  try {
    while (!peekEOL(state)) {
      consumeExpression(state);
    }
  } catch (exc) {
    error = "" + exc;
  }

  state.error = error;
}

function replOnInput() {
  const commandline = document.getElementById("pokaCommandLine");
  if (commandline === undefined || !(commandline instanceof HTMLInputElement)) {
    throw "No commandline";
  }
  const preview = document.getElementById("output_preview");
  if (preview === undefined || !(preview instanceof HTMLDivElement)) {
    throw "No preview";
  }
  const env: { [word: string]: PokaValue } = {};
  for (const [_, day] of Object.entries(AOC2025)) {
    env[day.input_name] = pokaScalarStringMake(day.input_text);
  }
  for (const [varName, varValue] of Object.entries(REPL_ENV)) {
    env[varName] = varValue;
  }
  const state = pokaInterpreterMake(commandline.value, env);
  pokaInterpreterEvaluate(state);
  preview.innerText = pokaInterpreterShow(state);
}

function replClipboardRead(): void {
  navigator.clipboard.readText().then((text: string) => {
    REPL_ENV["clipboard"] = pokaScalarStringMake(text);
  });
}

function main(): void {
  const commandline = document.getElementById("pokaCommandLine");
  if (commandline === undefined || !(commandline instanceof HTMLInputElement)) {
    throw "No commandline";
  }
  commandline.addEventListener("input", replOnInput);

  const clipboardReadButton = document.getElementById("replClipboardRead");
  if (
    clipboardReadButton === undefined ||
    !(clipboardReadButton instanceof HTMLButtonElement)
  ) {
    throw "No button";
  }
  clipboardReadButton.addEventListener("click", replClipboardRead);
}

const REPL_ENV: { [word: string]: PokaValue } = {};
if (typeof document !== "undefined") {
  main();
}
