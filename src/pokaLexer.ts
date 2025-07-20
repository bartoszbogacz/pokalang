interface PokaLexemeNumber {
  _kind: "Number";
  value: number;
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
  sigil: string;
  value: string;
}

interface PokaLexemeForm {
  _kind: "Form";
  text: string;
}

interface PokaLexemeComma {
  _kind: "Comma";
}

interface PokaLexemeListStart {
  _kind: "ListStart";
}

interface PokaLexemeListEnd {
  _kind: "ListEnd";
}

interface PokaLexemeStartScope {
  _kind: "StartScope";
}

interface PokaLexemeEndScope {
  _kind: "EndScope";
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
  state.lexemes.push({ _kind: "Comma" });
  state.textPos++;
}

function pokaLexerConsumeListStart(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "ListStart" });
  state.textPos++;
}

function pokaLexerConsumeListEnd(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "ListEnd" });
  state.textPos++;
}

function pokaLexerConsumeStartScope(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "StartScope" });
  state.textPos++;
}

function pokaLexerConsumeEndScope(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "EndScope" });
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
  const value = parseFloat(text);
  if (Number.isNaN(value)) {
    throw "Invalid number: " + text;
  }
  state.lexemes.push({
    _kind: "Number",
    value,
  });
}

function pokaLexerConsumeString(state: PokaLexerState): void {
  state.textPos++; // opening quote
  const start = state.textPos;
  while (
    state.textPos < state.line.length &&
    state.line.charAt(state.textPos) !== '"'
  ) {
    state.textPos++;
  }
  const value = state.line.slice(start, state.textPos);
  state.textPos++; // closing quote
  state.lexemes.push({
    _kind: "String",
    text: value.replace(/\\n/g, "\n"),
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
  const sigil = state.line.charAt(state.textPos);
  state.textPos++; // consume sigil
  const start = state.textPos;
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
    sigil,
    value: state.line.slice(start, state.textPos),
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
  switch (lex._kind) {
    case "Number":
      return lex.value.toString();
    case "String":
      return '"' + lex.text + '"';
    case "PlainIdentifier":
      return lex.text;
    case "SigilIdentifier":
      return lex.sigil + lex.value;
    case "Form":
      return lex.text;
    case "Comma":
      return ",";
    case "ListStart":
      return "[";
    case "ListEnd":
      return "]";
    case "StartScope":
      return "{";
    case "EndScope":
      return "}";
  }
}

interface PokaLexerTestCase {
  text: string;
  lexemes: PokaLexeme[];
}

const POKA_LEXER_TEST_CASES: PokaLexerTestCase[] = [
  {
    text: "1 2 add",
    lexemes: [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "[1, 2]",
    lexemes: [
      { _kind: "ListStart" },
      { _kind: "Number", value: 1 },
      { _kind: "Comma" },
      { _kind: "Number", value: 2 },
      { _kind: "ListEnd" },
    ],
  },
  {
    text: '"hi" =a $a',
    lexemes: [
      { _kind: "String", text: "hi" },
      { _kind: "SigilIdentifier", sigil: "=", value: "a" },
      { _kind: "SigilIdentifier", sigil: "$", value: "a" },
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
      { _kind: "Number", value: -1.5 },
      { _kind: "Number", value: 3.2 },
      { _kind: "PlainIdentifier", text: "mul" },
    ],
  },
  {
    text: "1   2   add",
    lexemes: [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "1\n 2 add",
    lexemes: [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "1\t\n 2\tadd",
    lexemes: [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  },
  {
    text: "TRY { 0 } CATCH { 1 }",
    lexemes: [
      { _kind: "Form", text: "TRY" },
      { _kind: "StartScope" },
      { _kind: "Number", value: 0 },
      { _kind: "EndScope" },
      { _kind: "Form", text: "CATCH" },
      { _kind: "StartScope" },
      { _kind: "Number", value: 1 },
      { _kind: "EndScope" },
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
    if (
      expected._kind === "Number" &&
      got._kind === "Number" &&
      expected.value === got.value
    ) {
      pokaLexerPopNumber(state);
    } else if (
      expected._kind === "String" &&
      got._kind === "String" &&
      expected.text === got.text
    ) {
      pokaLexerPopString(state);
    } else if (
      expected._kind === "PlainIdentifier" &&
      got._kind === "PlainIdentifier" &&
      expected.text === got.text
    ) {
      pokaLexerPopPlainIdentifer(state);
    } else if (
      expected._kind === "SigilIdentifier" &&
      got._kind === "SigilIdentifier" &&
      expected.sigil === got.sigil &&
      expected.value === got.value
    ) {
      pokaLexerPopSigilIdentifier(state);
    } else if (
      expected._kind === "Form" &&
      got._kind === "Form" &&
      expected.text === got.text
    ) {
      pokaLexerPopForm(state);
    } else if (expected._kind === "Comma" && got._kind === "Comma") {
      pokaLexerPopComma(state);
    } else if (expected._kind === "ListStart" && got._kind === "ListStart") {
      pokaLexerPopListStart(state);
    } else if (expected._kind === "ListEnd" && got._kind === "ListEnd") {
      pokaLexerPopListEnd(state);
    } else if (expected._kind === "StartScope" && got._kind === "StartScope") {
      pokaLexerPopStartScope(state);
    } else if (expected._kind === "EndScope" && got._kind === "EndScope") {
      pokaLexerPopEndScope(state);
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
