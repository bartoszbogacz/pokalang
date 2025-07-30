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
  lexer: PokaLexerState;
  stack: PokaValue[];
  env: { [word: string]: PokaValue };
}

interface PokaWord4 {
  doc: string[];
  docTest?: string[];
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
  return result.join("\n");
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
  const value = parseFloat(token.text);
  if (Number.isNaN(value)) {
    throw "Invalid number: " + token.text;
  }
  state.stack.push(pokaScalarNumberMake(value));
}

function consumeString(state: InterpreterState): void {
  const token = pokaLexerPopString(state.lexer);
  if (!token.text.startsWith('"') || !token.text.endsWith('"')) {
    throw "Invalid string literal";
  }
  const inner = token.text.slice(1, -1);
  const unescaped = inner.replace(/\\n/g, "\n");
  state.stack.push(pokaScalarStringMake(unescaped));
}

function consumeIdentifier(state: InterpreterState): void {
  const token = pokaLexerPopIdentifier(state.lexer);
  if (token.text.startsWith("$")) {
    const variableName = token.text.slice(1);
    const value = state.env[variableName];
    if (value === undefined) {
      throw "No such variable: " + variableName;
    }
    state.stack.push(value);
  } else if (token.text.startsWith("=")) {
    const variableName = token.text.slice(1);
    const value = state.stack.pop();
    if (value === undefined) {
      throw "Stack underflow";
    }
    state.env[variableName] = value;
  } else {
    const word = POKA_WORDS4[token.text];
    if (word === undefined) {
      throw "No such function: " + token.text;
    }
    word.fun(state.stack);
  }
}

function consumeExpression(state: InterpreterState): void {
  const token = pokaLexerPeek(state.lexer);
  if (token._kind === "Number") {
    consumeNumber(state);
  } else if (token._kind === "String") {
    consumeString(state);
  } else if (token._kind === "Identifier") {
    consumeIdentifier(state);
  } else if (token._kind === "ListStart") {
    consumeList(state);
  } else {
    throw "Unexpected token: `" + pokaLexerShowLexeme(token) + "`";
  }
}

function pokaInterpreterEvaluate(
  environment: { [word: string]: PokaValue },
  program: string,
): string {
  const lex = pokaLex(program);

  const state: InterpreterState = {
    env: environment,
    lexer: lex,
    stack: [],
  };

  while (!pokaLexerPeekEOL(state.lexer)) {
    consumeExpression(state);
  }

  return pokaInterpreterShow(state);
}
