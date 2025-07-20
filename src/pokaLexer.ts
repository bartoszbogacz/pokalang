interface PokaLexemeNumber {
  _kind: "Number";
  text: string;
}

interface PokaLexemeString {
  _kind: "String";
  text: string;
}

interface PokaLexemePlainIdentifier {
  _kind: "PlainIdentifier";
  text: string;
}

interface PokaLexemeSigilIdentifier {
  _kind: "SigilIdentifier";
  text: string;
}

interface PokaLexemeForm {
  _kind: "Form";
  text: string;
}

interface PokaLexemeComma {
  _kind: "Comma";
  text: string;
}

interface PokaLexemeListStart {
  _kind: "ListStart";
  text: string;
}

interface PokaLexemeListEnd {
  _kind: "ListEnd";
  text: string;
}

interface PokaLexemeStartScope {
  _kind: "StartScope";
  text: string;
}

interface PokaLexemeEndScope {
  _kind: "EndScope";
  text: string;
}

type PokaLexeme =
  | PokaLexemeNumber
  | PokaLexemeString
  | PokaLexemePlainIdentifier
  | PokaLexemeSigilIdentifier
  | PokaLexemeForm
  | PokaLexemeComma
  | PokaLexemeListStart
  | PokaLexemeListEnd
  | PokaLexemeStartScope
  | PokaLexemeEndScope;

interface PokaLexerState {
  line: string;
  textPos: number;
  lexemePos: number;
  lexemes: PokaLexeme[];
  error?: string;
}

function pokaLexerIsDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function pokaLexerIsPlainIdentifierStart(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.textPos);
  return c >= "a" && c <= "z";
}

function pokaLexerIsSigilIdentifierStart(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.textPos);
  return c === "$" || c === "=";
}

function pokaLexerIsForm(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.textPos);
  return c >= "A" && c <= "Z";
}

function pokaLexerIsEol(state: PokaLexerState): boolean {
  return state.textPos >= state.line.length;
}

function pokaLexerIsNumberStart(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.textPos);
  return (
    pokaLexerIsDigit(c) ||
    (c === "-" && pokaLexerIsDigit(state.line.charAt(state.textPos + 1)))
  );
}

function pokaLexerIsStringStart(state: PokaLexerState): boolean {
  return state.line.charAt(state.textPos) === '"';
}

function pokaLexerIsComma(state: PokaLexerState): boolean {
  return state.line.charAt(state.textPos) === ",";
}

function pokaLexerIsListStart(state: PokaLexerState): boolean {
  return state.line.charAt(state.textPos) === "[";
}

function pokaLexerIsListEnd(state: PokaLexerState): boolean {
  return state.line.charAt(state.textPos) === "]";
}

function pokaLexerIsStartScope(state: PokaLexerState): boolean {
  return state.line.charAt(state.textPos) === "{";
}

function pokaLexerIsEndScope(state: PokaLexerState): boolean {
  return state.line.charAt(state.textPos) === "}";
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

function pokaLexerConsumeComma(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "Comma", text: "," });
  state.textPos++;
}

function pokaLexerConsumeListStart(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "ListStart", text: "[" });
  state.textPos++;
}

function pokaLexerConsumeListEnd(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "ListEnd", text: "]" });
  state.textPos++;
}

function pokaLexerConsumeStartScope(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "StartScope", text: "{" });
  state.textPos++;
}

function pokaLexerConsumeEndScope(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "EndScope", text: "}" });
  state.textPos++;
}

function pokaLexerConsumeNumber(state: PokaLexerState): void {
  const start = state.textPos;
  if (state.line.charAt(state.textPos) === "-") {
    state.textPos++;
  }
  while (pokaLexerIsDigit(state.line.charAt(state.textPos))) {
    state.textPos++;
  }
  if (state.line.charAt(state.textPos) === ".") {
    state.textPos++;
    while (pokaLexerIsDigit(state.line.charAt(state.textPos))) {
      state.textPos++;
    }
  }
  const text = state.line.slice(start, state.textPos);
  state.lexemes.push({
    _kind: "Number",
    text,
  });
}

function pokaLexerConsumeString(state: PokaLexerState): void {
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
}

function pokaLexerConsumePlainIdentifier(state: PokaLexerState): void {
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
    _kind: "PlainIdentifier",
    text: state.line.slice(start, state.textPos),
  });
}

function pokaLexerConsumeSigilIdentifier(state: PokaLexerState): void {
  const start = state.textPos;
  state.textPos++; // consume sigil
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
    _kind: "SigilIdentifier",
    text: state.line.slice(start, state.textPos),
  });
}

function pokaLexerConsumeForm(state: PokaLexerState): void {
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
}

function pokaLexerConsume(state: PokaLexerState): void {
  while (!pokaLexerIsEol(state)) {
    pokaLexerConsumeWhitespace(state);
    if (pokaLexerIsEol(state)) {
      break;
    }
    if (pokaLexerIsNumberStart(state)) {
      pokaLexerConsumeNumber(state);
    } else if (pokaLexerIsStringStart(state)) {
      pokaLexerConsumeString(state);
    } else if (pokaLexerIsSigilIdentifierStart(state)) {
      pokaLexerConsumeSigilIdentifier(state);
    } else if (pokaLexerIsPlainIdentifierStart(state)) {
      pokaLexerConsumePlainIdentifier(state);
    } else if (pokaLexerIsForm(state)) {
      pokaLexerConsumeForm(state);
    } else if (pokaLexerIsListStart(state)) {
      pokaLexerConsumeListStart(state);
    } else if (pokaLexerIsListEnd(state)) {
      pokaLexerConsumeListEnd(state);
    } else if (pokaLexerIsStartScope(state)) {
      pokaLexerConsumeStartScope(state);
    } else if (pokaLexerIsEndScope(state)) {
      pokaLexerConsumeEndScope(state);
    } else if (pokaLexerIsComma(state)) {
      pokaLexerConsumeComma(state);
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

function pokaLexerPopNumber(state: PokaLexerState): PokaLexemeNumber {
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

function pokaLexerPopString(state: PokaLexerState): PokaLexemeString {
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

function pokaLexerPopPlainIdentifer(
  state: PokaLexerState,
): PokaLexemePlainIdentifier {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: PlainIdentifier Got: End of input.";
  }
  if (lex._kind !== "PlainIdentifier") {
    throw "Expected: PlainIdentifier Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopSigilIdentifier(
  state: PokaLexerState,
): PokaLexemeSigilIdentifier {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: SigilIdentifier Got: End of input.";
  }
  if (lex._kind !== "SigilIdentifier") {
    throw "Expected: SigilIdentifier Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopForm(
  state: PokaLexerState,
  value?: string,
): PokaLexemeForm {
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

function pokaLexerPopComma(state: PokaLexerState): PokaLexemeComma {
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

function pokaLexerPopListStart(state: PokaLexerState): PokaLexemeListStart {
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

function pokaLexerPopListEnd(state: PokaLexerState): PokaLexemeListEnd {
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

function pokaLexerPopStartScope(state: PokaLexerState): PokaLexemeStartScope {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: StartScope Got: End of input.";
  }
  if (lex._kind !== "StartScope") {
    throw "Expected: StartScope Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPopEndScope(state: PokaLexerState): PokaLexemeEndScope {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: EndScope Got: End of input.";
  }
  if (lex._kind !== "EndScope") {
    throw "Expected: EndScope Got: " + pokaLexerShowLexeme(lex);
  }
  state.lexemePos++;
  return lex;
}

function pokaLexerPeekEndScope(state: PokaLexerState): boolean {
  const lex = state.lexemes[state.lexemePos];
  return lex !== undefined && lex._kind === "EndScope";
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

interface PokaLexerTestCase {
  text: string;
  lexemes: PokaLexeme[];
}

const POKA_LEXER_TEST_CASES: PokaLexerTestCase[] = [
  {
    text: "1 2 add",
    lexemes: [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "[1, 2]",
    lexemes: [
      { _kind: "ListStart", text: "[" },
      { _kind: "Number", text: "1" },
      { _kind: "Comma", text: "," },
      { _kind: "Number", text: "2" },
      { _kind: "ListEnd", text: "]" },
    ],
  },
  {
    text: '"hi" =a $a',
    lexemes: [
      { _kind: "String", text: '"hi"' },
      { _kind: "SigilIdentifier", text: "=a" },
      { _kind: "SigilIdentifier", text: "$a" },
    ],
  },
  {
    text: "FOR x EACH",
    lexemes: [
      { _kind: "Form", text: "FOR" },
      { _kind: "PlainIdentifier", text: "x" },
      { _kind: "Form", text: "EACH" },
    ],
  },
  {
    text: "-1.5 3.2 mul",
    lexemes: [
      { _kind: "Number", text: "-1.5" },
      { _kind: "Number", text: "3.2" },
      { _kind: "PlainIdentifier", text: "mul" },
    ],
  },
  {
    text: "1   2   add",
    lexemes: [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "1\n 2 add",
    lexemes: [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "1\t\n 2\tadd",
    lexemes: [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "TRY { 0 } CATCH { 1 }",
    lexemes: [
      { _kind: "Form", text: "TRY" },
      { _kind: "StartScope", text: "{" },
      { _kind: "Number", text: "0" },
      { _kind: "EndScope", text: "}" },
      { _kind: "Form", text: "CATCH" },
      { _kind: "StartScope", text: "{" },
      { _kind: "Number", text: "1" },
      { _kind: "EndScope", text: "}" },
    ],
  },
];

function pokaLexerRunTest(testCase: PokaLexerTestCase): void {
  const state = pokaLex(testCase.text);
  if (state.error !== undefined) {
    throw "pokaLexerRunTests: " + state.error;
  }
  for (const expected of testCase.lexemes) {
    const got = pokaLexerPeek(state);
    if (expected._kind === got._kind && expected.text === got.text) {
      switch (got._kind) {
        case "Number":
          pokaLexerPopNumber(state);
          break;
        case "String":
          pokaLexerPopString(state);
          break;
        case "PlainIdentifier":
          pokaLexerPopPlainIdentifer(state);
          break;
        case "SigilIdentifier":
          pokaLexerPopSigilIdentifier(state);
          break;
        case "Form":
          pokaLexerPopForm(state);
          break;
        case "Comma":
          pokaLexerPopComma(state);
          break;
        case "ListStart":
          pokaLexerPopListStart(state);
          break;
        case "ListEnd":
          pokaLexerPopListEnd(state);
          break;
        case "StartScope":
          pokaLexerPopStartScope(state);
          break;
        case "EndScope":
          pokaLexerPopEndScope(state);
          break;
      }
    } else {
      throw (
        "pokaLexerRunTests: Expected: " +
        pokaLexerShowLexeme(expected) +
        " Got: " +
        pokaLexerShowLexeme(got)
      );
    }
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerRunTests: Expected EOL Got: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerRunTests(): string[] {
  const result: string[] = [];

  for (const testCase of POKA_LEXER_TEST_CASES) {
    try {
      pokaLexerRunTest(testCase);
      result.push("  OK | " + testCase.text.replace("\n", "\\n"));
    } catch (exc) {
      result.push("FAIL | " + testCase.text.replace("\n", "\\n") + ": " + exc);
    }
  }

  return result;
}
