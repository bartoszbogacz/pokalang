type PokaLexemeKind =
  | "Number"
  | "String"
  | "Identifier"
  | "Form"
  | "Comma"
  | "ListStart"
  | "ListEnd";

interface PokaLexeme {
  _kind: PokaLexemeKind;
  text: string;
}

interface PokaLexerState {
  line: string;
  textPos: number;
  lexemePos: number;
  lexemes: PokaLexeme[];
  error?: string;
}

function pokaLexerIsEol(state: PokaLexerState): boolean {
  return state.textPos >= state.line.length;
}

function pokaLexerConsumeWhitespace(state: PokaLexerState): number {
  let count = 0;
  while (true) {
    const c = state.line.charAt(state.textPos);
    if (c === " " || c === "\n" || c === "\t") {
      state.textPos++;
      count++;
    } else {
      break;
    }
  }
  return count;
}

function pokaLexerConsumeComma(state: PokaLexerState): boolean {
  if (state.line.charAt(state.textPos) !== ",") {
    return false;
  }
  state.lexemes.push({ _kind: "Comma", text: "," });
  state.textPos++;
  return true;
}

function pokaLexerConsumeListStart(state: PokaLexerState): boolean {
  if (state.line.charAt(state.textPos) !== "[") {
    return false;
  }
  state.lexemes.push({ _kind: "ListStart", text: "[" });
  state.textPos++;
  return true;
}

function pokaLexerConsumeListEnd(state: PokaLexerState): boolean {
  if (state.line.charAt(state.textPos) !== "]") {
    return false;
  }
  state.lexemes.push({ _kind: "ListEnd", text: "]" });
  state.textPos++;
  return true;
}

function pokaLexerConsumeNumber(state: PokaLexerState): boolean {
  const c0 = state.line.charAt(state.textPos);
  if (!(c0 === "-" || (c0 >= "0" && c0 <= "9"))) {
    return false;
  }
  const start = state.textPos;
  if (c0 === "-") {
    state.textPos++;
  }
  while (state.textPos < state.line.length) {
    const c = state.line.charAt(state.textPos);
    if (c >= "0" && c <= "9") {
      state.textPos++;
    } else {
      break;
    }
  }
  if (state.line.charAt(state.textPos) === ".") {
    state.textPos++;
    while (state.textPos < state.line.length) {
      const c = state.line.charAt(state.textPos);
      if (c >= "0" && c <= "9") {
        state.textPos++;
      } else {
        break;
      }
    }
  }
  const text = state.line.slice(start, state.textPos);
  state.lexemes.push({
    _kind: "Number",
    text,
  });
  return true;
}

function pokaLexerConsumeString(state: PokaLexerState): boolean {
  if (state.line.charAt(state.textPos) !== '"') {
    return false;
  }
  const start = state.textPos;
  state.textPos++; // opening quote
  while (
    state.textPos < state.line.length &&
    state.line.charAt(state.textPos) !== '"'
  ) {
    state.textPos++;
  }
  state.textPos++; // closing quote
  const text = state.line.slice(start, state.textPos);
  state.lexemes.push({
    _kind: "String",
    text,
  });
  return true;
}

function pokaLexerConsumeIdentifier(state: PokaLexerState): boolean {
  const c0 = state.line.charAt(state.textPos);
  if (!(c0 === "$" || c0 === "=" || (c0 >= "a" && c0 <= "z"))) {
    return false;
  }
  const start = state.textPos;
  state.textPos++;
  while (true) {
    const c = state.line.charAt(state.textPos);
    if (
      (c >= "a" && c <= "z") ||
      (c >= "A" && c <= "Z") ||
      (c >= "0" && c <= "9")
    ) {
      state.textPos++;
    } else {
      break;
    }
  }
  state.lexemes.push({
    _kind: "Identifier",
    text: state.line.slice(start, state.textPos),
  });
  return true;
}

function pokaLexerConsumeForm(state: PokaLexerState): boolean {
  const c0 = state.line.charAt(state.textPos);
  if (!(c0 >= "A" && c0 <= "Z")) {
    return false;
  }
  const start = state.textPos;
  state.textPos++;
  while (true) {
    const c = state.line.charAt(state.textPos);
    if (c >= "A" && c <= "Z") {
      state.textPos++;
    } else {
      break;
    }
  }
  state.lexemes.push({
    _kind: "Form",
    text: state.line.slice(start, state.textPos),
  });
  return true;
}

function pokaLexerConsume(state: PokaLexerState): void {
  while (!pokaLexerIsEol(state)) {
    pokaLexerConsumeWhitespace(state);
    if (pokaLexerIsEol(state)) {
      break;
    }
    if (pokaLexerConsumeNumber(state)) {
      continue;
    } else if (pokaLexerConsumeString(state)) {
      continue;
    } else if (pokaLexerConsumeIdentifier(state)) {
      continue;
    } else if (pokaLexerConsumeForm(state)) {
      continue;
    } else if (pokaLexerConsumeListStart(state)) {
      continue;
    } else if (pokaLexerConsumeListEnd(state)) {
      continue;
    } else if (pokaLexerConsumeComma(state)) {
      continue;
    } else {
      throw "Unknown token";
    }
  }
}

function pokaLex(line: string): PokaLexerState {
  let state: PokaLexerState = {
    line: line,
    textPos: 0,
    lexemePos: 0,
    lexemes: [],
  };
  try {
    pokaLexerConsume(state);
  } catch (exc) {
    state.error = "" + exc;
  }
  return state;
}

function pokaLexerPeek(state: PokaLexerState): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Unexpected end of input";
  }
  return lex;
}

function pokaLexerPeekEOL(state: PokaLexerState): boolean {
  return state.lexemePos >= state.lexemes.length;
}

function pokaLexerPopNumber(state: PokaLexerState): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: Number Got: End of input.";
  }
  if (lex._kind !== "Number") {
    throw "Expected: Number Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopString(state: PokaLexerState): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: String Got: End of input.";
  }
  if (lex._kind !== "String") {
    throw "Expected: String Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopIdentifier(state: PokaLexerState): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: Identifier Got: End of input.";
  }
  if (lex._kind !== "Identifier") {
    throw "Expected: Identifier Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopForm(state: PokaLexerState, value?: string): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: Form Got: End of input.";
  }
  if (lex._kind !== "Form") {
    throw "Expected: Form Got: " + pokaLexerShowLexeme(lex);
  }
  if (value !== undefined && lex.text !== value) {
    throw "Expected: Form " + value + " Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopComma(state: PokaLexerState): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: Comma Got: End of input.";
  }
  if (lex._kind !== "Comma") {
    throw "Expected: Comma Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopListStart(state: PokaLexerState): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: ListStart Got: End of input.";
  }
  if (lex._kind !== "ListStart") {
    throw "Expected: ListStart Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopListEnd(state: PokaLexerState): PokaLexeme {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: ListEnd Got: End of input.";
  }
  if (lex._kind !== "ListEnd") {
    throw "Expected: ListEnd Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopLexeme(state: PokaLexerState): void {
  if (state.lexemePos >= state.lexemes.length) {
    throw "Unexpected end of input.";
  }
  state.lexemePos++;
}

function pokaLexerShowLexeme(lex: PokaLexeme): string {
  return lex.text;
}
