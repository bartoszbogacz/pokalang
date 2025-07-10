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

function peekEOL(state: InterpreterState): boolean {
  return state.pos >= state.lexemes.length;
}

function consumeList(state: InterpreterState): void {
  const values: PokaValue[] = [];
  const origStack = state.stack;
  pokaLexerPop(state, "ListStart");
  while (!peekEOL(state) && pokaLexerPeek(state)._kind !== "ListEnd") {
    state.stack = origStack.slice();
    while (!peekEOL(state) && pokaLexerPeek(state)._kind !== "ListEnd") {
      if (pokaLexerPeek(state)._kind === "Comma") {
        pokaLexerPop(state, "Comma");
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
  pokaLexerPop(state, "ListEnd");
  state.stack = origStack;
  state.stack.push(pokaListMake(values));
}

function consumeExpression(state: InterpreterState): void {
  if (peekEOL(state)) {
    throw "Expected expression";
  }
  const token = pokaLexerPeek(state);
  if (token._kind === "Number") {
    pokaLexerPop(state, "Number");
    state.stack.push(pokaScalarNumberMake(token.value));
    return;
  }
  if (token._kind === "String") {
    pokaLexerPop(state, "String");
    state.stack.push(pokaScalarStringMake(token.text));
    return;
  }
  if (token._kind === "SigilIdentifier") {
    pokaLexerPop(state, "SigilIdentifier");
    if (token.text.startsWith("$")) {
      const variableName = token.text.slice(1);
      const value = state.env[variableName];
      if (value === undefined) {
        throw "No such variable: " + variableName;
      }
      state.stack.push(value);
      return;
    }
    if (token.text.startsWith("=")) {
      const variableName = token.text.slice(1);
      const value = state.stack.pop();
      if (value === undefined) {
        throw "Stack underflow";
      }
      state.env[variableName] = value;
      return;
    }
    throw "Invalid sigil";
  }
  if (token._kind === "PlainIdentifier") {
    pokaLexerPop(state, "PlainIdentifier");
    const word = POKA_WORDS4[token.text];
    if (word === undefined) {
      throw "No such function: " + token.text;
    }
    word.fun(state.stack);
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
