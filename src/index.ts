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
  | PokaRecord
  | PokaException;

interface InterpreterState {
  lexer: PokaLexerState;
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

function consumeList(state: InterpreterState): void {
  const values: PokaValue[] = [];
  const origStack = state.stack;
  pokaLexerPopListStart(state.lexer);
  while (pokaLexerPeek(state.lexer)._kind !== "ListEnd") {
    state.stack = origStack.slice();
    while (pokaLexerPeek(state.lexer)._kind !== "ListEnd") {
      if (pokaLexerPeek(state.lexer)._kind === "Comma") {
        pokaLexerPopComma(state.lexer);
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
  pokaLexerPopListEnd(state.lexer);
  state.stack = origStack;
  state.stack.push(pokaListMake(values));
}

function consumeNumber(state: InterpreterState): void {
  const token = pokaLexerPopNumber(state.lexer);
  state.stack.push(pokaScalarNumberMake(token.value));
}

function consumeString(state: InterpreterState): void {
  const token = pokaLexerPopString(state.lexer);
  state.stack.push(pokaScalarStringMake(token.text));
}

function consumeSigilIdentifier(state: InterpreterState): void {
  const token = pokaLexerPopSigilIdentifier(state.lexer);
  if (token.sigil === "$") {
    const variableName = token.value;
    const value = state.env[variableName];
    if (value === undefined) {
      throw "No such variable: " + variableName;
    }
    state.stack.push(value);
  } else if (token.sigil === "=") {
    const variableName = token.value;
    const value = state.stack.pop();
    if (value === undefined) {
      throw "Stack underflow";
    }
    state.env[variableName] = value;
    return;
  } else {
    throw "Invalid sigil";
  }
}

function consumePlainIdentifier(state: InterpreterState): void {
  const token = pokaLexerPopPlainIdentifer(state.lexer);
  const word = POKA_WORDS4[token.text];
  if (word === undefined) {
    throw "No such function: " + token.text;
  }
  word.fun(state.stack);
}

function consumeFormTRY(state: InterpreterState): void {
  pokaLexerPopForm(state.lexer, "TRY");
  pokaLexerPopStartScope(state.lexer);
  let pokaExc: PokaException | undefined = undefined;
  const origStack = state.stack.slice();
  try {
    while (!pokaLexerPeekEndScope(state.lexer)) {
      consumeExpression(state);
    }
  } catch (exc) {
    pokaExc = pokaExceptionMake("" + exc);
  }
  if (pokaExc !== undefined) {
    while (!pokaLexerPeekEndScope(state.lexer)) {
      pokaLexerPopLexeme(state.lexer);
    }
  }
  pokaLexerPopEndScope(state.lexer);
  pokaLexerPopForm(state.lexer, "CATCH");
  pokaLexerPopStartScope(state.lexer);
  if (pokaExc !== undefined) {
    state.stack = origStack;
    state.stack.push(pokaExc);
    while (!pokaLexerPeekEndScope(state.lexer)) {
      consumeExpression(state);
    }
  } else {
    while (!pokaLexerPeekEndScope(state.lexer)) {
      pokaLexerPopLexeme(state.lexer);
    }
  }
  pokaLexerPopEndScope(state.lexer);
}

function consumeExpression(state: InterpreterState): void {
  const token = pokaLexerPeek(state.lexer);
  if (token._kind === "Number") {
    consumeNumber(state);
  } else if (token._kind === "String") {
    consumeString(state);
  } else if (token._kind === "SigilIdentifier") {
    consumeSigilIdentifier(state);
  } else if (token._kind === "PlainIdentifier") {
    consumePlainIdentifier(state);
  } else if (token._kind === "ListStart") {
    consumeList(state);
  } else if (token._kind === "Form" && token.text === "TRY") {
    consumeFormTRY(state);
  } else {
    throw "Unexpected token: `" + pokaLexerShowLexeme(token) + "`";
  }
}

function pokaInterpreterMake(
  line: string,
  environment: { [word: string]: PokaValue },
): InterpreterState {
  const lex = pokaLex(line);
  const state: InterpreterState = {
    lexer: lex,
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
    while (!pokaLexerPeekEOL(state.lexer)) {
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
