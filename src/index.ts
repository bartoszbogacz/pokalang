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
  env: { [word: string]: PokaValue };
  ports: { [name: string]: string };
}

interface PokaWord4 {
  doc: string[];
  fun: (env: { [word: string]: PokaValue }, stack: PokaValue[]) => void;
}

function pokaShow(value: PokaValue): string {
  if (value._type === "ScalarBoolean") {
    return value.value ? "True" : "False";
  } else if (value._type === "ScalarNumber") {
    return value.value.toString();
  } else if (value._type === "ScalarString") {
    return '"' + value.value.replace("\n", "\\n") + '"';
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

function pokaInterpreterShow(state: InterpreterState): string {
  const result: string[] = [];
  for (const value of state.stack.slice().reverse()) {
    result.push(pokaShow(value));
  }
  return state.error + "\n" + result.join("\n");
}

function pokaScalarBooleanMake(value: boolean): PokaScalarBoolean {
  return { _type: "ScalarBoolean", value: value };
}

function pokaScalarNumberMake(value: number): PokaScalarNumber {
  return { _type: "ScalarNumber", value: value };
}

function pokaScalarStringMake(value: string): PokaScalarString {
  return { _type: "ScalarString", value: value };
}

function pokaListMake(values: PokaValue[]): PokaList {
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

  state.stack.push(pokaListMake(values));
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

  if (token === "read") {
    const arg2 = state.stack.pop();
    if (arg2 === undefined) {
      throw "Stack underflow";
    }
    const arg1 = state.stack.pop();
    if (arg1 === undefined) {
      throw "Stack underflow";
    }
    if (arg1._type !== "ScalarString") {
      throw "Type mismatch";
    }
    if (arg2._type !== "ScalarString") {
      throw "Type mismatch";
    }
    let portValue = state.ports[arg1.value];
    if (portValue === undefined) {
      portValue = arg2.value;
      state.ports[arg1.value] = portValue;
    }
    state.stack.push(pokaScalarStringMake(portValue));
  } else {
    pokaDispatch3(state.env, state.stack, token);
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

function pokaDispatch3(
  env: { [word: string]: PokaValue },
  stack: PokaValue[],
  token: string,
): void {
  const value: PokaValue | undefined = env[token];
  if (value !== undefined) {
    stack.push(value);
    return;
  }

  const word = POKA_WORDS4[token];

  if (word !== undefined) {
    word.fun(env, stack);
    return;
  }

  throw "No such function";
}

function pokaInterpreterMake(
  line: string,
  environment: { [word: string]: PokaValue },
  ports: { [port: string]: string },
): InterpreterState {
  const state: InterpreterState = {
    line: line.replace("\\n", "\n"),
    pos: 0,
    stack: [],
    error: "",
    env: {},
    ports: {},
  };

  for (const [word, value] of Object.entries(environment)) {
    state.env[word] = value;
  }

  for (const [port, value] of Object.entries(ports)) {
    state.ports[port] = value;
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

function pokaInterpreterInteract(state: InterpreterState): void {
  const inputDiv = document.getElementById("pokaPorts");
  if (inputDiv === null) {
    throw "No input div";
  }

  const collection = document.getElementsByClassName("PokaPortDiv");
  for (let i = 0; i < collection.length; i++) {
    const elem = collection[i] as Element;
    const portName = elem.id.slice("pokaPortDiv-".length);
    if (!(portName in state.ports)) {
      elem.remove();
    }
  }

  for (const [portName, value] of Object.entries(state.ports)) {
    let textAreaElem = document.getElementById("pokaPort-" + portName);
    if (textAreaElem === null) {
      const portDiv = document.createElement("div");
      portDiv.className = "PokaPortDiv";
      portDiv.id = "pokaPortDiv-" + portName;

      textAreaElem = document.createElement("textarea");
      if (!(textAreaElem instanceof HTMLTextAreaElement)) {
        throw "Internal error: Wrong element type";
      }
      textAreaElem.className = "PokaPort";
      textAreaElem.id = "pokaPort-" + portName;
      textAreaElem.value = value;
      textAreaElem.addEventListener("input", pokaOnChange);

      portDiv.appendChild(textAreaElem);
      inputDiv.appendChild(portDiv);
    } else {
      if (!(textAreaElem instanceof HTMLTextAreaElement)) {
        throw "Internal error: Wrong element type";
      }
      state.ports[portName] = textAreaElem.value;
    }
  }
}

function pokaOnChange() {
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
  const state1 = pokaInterpreterMake(commandline.value, env, {});
  pokaInterpreterEvaluate(state1);
  pokaInterpreterInteract(state1);
  const state2 = pokaInterpreterMake(commandline.value, env, state1.ports);
  pokaInterpreterEvaluate(state2);
  preview.innerText = pokaInterpreterShow(state2);
}
