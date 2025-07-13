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
  lexemes: PokaLexeme[];
  pos: number;
  stack: PokaValue[];
  error: string;
  env: { [word: string]: PokaValue };
}

interface PokaWord4 {
  doc: string[];
  fun: (stack: PokaValue[]) => void;
}

function pokaCallWordString(
  fun: (stack: PokaValue[]) => void,
  args: PokaValue[],
): string {
  const stack = args.slice();
  fun(stack);
  const result = stack.pop();
  if (result === undefined) {
    throw "Stack underflow";
  }
  if (result._type !== "ScalarString") {
    throw "Unexpected return type: " + result._type;
  }
  return result.value;
}

function pokaInterpreterShow(state: InterpreterState): string {
  const result: string[] = [];
  for (const value of state.stack.slice().reverse()) {
    const text = pokaCallWordString(pokaWordShow, [value]);
    result.push(text);
  }
  return state.error + "\n" + result.join("\n");
}

function peekEOL(state: InterpreterState): boolean {
  return state.pos >= state.lexemes.length;
}

function consumeList(state: InterpreterState): void {
  const values: PokaValue[] = [];
  const origStack = state.stack;
  pokaLexerPopListStart(state);
  while (!peekEOL(state) && pokaLexerPeek(state)._kind !== "ListEnd") {
    state.stack = origStack.slice();
    while (!peekEOL(state) && pokaLexerPeek(state)._kind !== "ListEnd") {
      if (pokaLexerPeek(state)._kind === "Comma") {
        pokaLexerPopComma(state);
        break;
      }
      consumeExpression(state);
    }
    const value = state.stack.pop();
    if (value === undefined) {
      throw "Stack empty in fork expression";
    }
    values.push(value);
  }
  pokaLexerPopListEnd(state);
  state.stack = origStack;
  state.stack.push(pokaListMake(values));
}

function consumeNumber(state: InterpreterState): void {
  const token = pokaLexerPopNumber(state);
  state.stack.push(pokaScalarNumberMake(token.value));
}

function consumeString(state: InterpreterState): void {
  const token = pokaLexerPopString(state);
  state.stack.push(pokaScalarStringMake(token.text));
}

function consumeSigilIdentifier(state: InterpreterState): void {
  const token = pokaLexerPopSigilIdentifier(state);
  if (token.sigil === "$") {
    const variableName = token.value;
    const value = state.env[variableName];
    if (value === undefined) {
      throw "No such variable: " + variableName;
    }
    state.stack.push(value);
    return;
  }
  if (token.sigil === "=") {
    const variableName = token.value;
    const value = state.stack.pop();
    if (value === undefined) {
      throw "Stack underflow";
    }
    state.env[variableName] = value;
    return;
  }
  throw "Invalid sigil";
}

function consumePlainIdentifier(state: InterpreterState): void {
  const token = pokaLexerPopPlainIdentifer(state);
  const word = POKA_WORDS4[token.text];
  if (word === undefined) {
    throw "No such function: " + token.text;
  }
  word.fun(state.stack);
}

function consumeExpression(state: InterpreterState): void {
  if (peekEOL(state)) {
    throw "Expected expression";
  }
  const token = pokaLexerPeek(state);
  if (token._kind === "Number") {
    consumeNumber(state);
    return;
  }
  if (token._kind === "String") {
    consumeString(state);
    return;
  }
  if (token._kind === "SigilIdentifier") {
    consumeSigilIdentifier(state);
    return;
  }
  if (token._kind === "PlainIdentifier") {
    consumePlainIdentifier(state);
    return;
  }
  if (token._kind === "ListStart") {
    consumeList(state);
    return;
  }
  throw "Expected expression";
}

function pokaInterpreterMake(
  line: string,
  environment: { [word: string]: PokaValue },
): InterpreterState {
  const lex = pokaLexerLex(line);
  const state: InterpreterState = {
    lexemes: lex.lexemes,
    pos: 0,
    stack: [],
    error: lex.error ? lex.error : "",
    env: {},
  };

  for (const [word, value] of Object.entries(environment)) {
    state.env[word] = value;
  }

  return state;
}

function pokaInterpreterEvaluate(state: InterpreterState): void {
  if (state.error !== "") {
    return;
  }
  let error = "";
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
