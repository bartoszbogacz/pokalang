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

type PokaLexeme =
  | PokaLexemeNumber
  | PokaLexemeString
  | PokaLexemePlainIdentifier
  | PokaLexemeSigilIdentifier
  | PokaLexemeForm
  | PokaLexemeComma
  | PokaLexemeListStart
  | PokaLexemeListEnd;

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

function pokaLexerPopForm(state: PokaLexerState): PokaLexemeForm {
  const lex = state.lexemes[state.lexemePos];
  if (lex === undefined) {
    throw "Expected: Form Got: End of input.";
  }
  if (lex._kind !== "Form") {
    throw "Expected: Form Got: " + pokaLexerShowLexeme(lex);
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
  }
}

function pokaLexerTestSimple(): void {
  const state = pokaLex("1 2 add");
  if (state.error !== undefined) {
    throw "pokaLexerTestSimple: " + state.error;
  }
  const t1 = pokaLexerPopNumber(state);
  if (t1.value !== 1) {
    throw "pokaLexerTestSimple: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(state);
  if (t2.value !== 2) {
    throw "pokaLexerTestSimple: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(state);
  if (t3.text !== "add") {
    throw "pokaLexerTestSimple: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestSimple: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerTestList(): void {
  const state = pokaLex("[1, 2]");
  if (state.error !== undefined) {
    throw "pokaLexerTestList: " + state.error;
  }
  const t1 = pokaLexerPopListStart(state);
  if (t1._kind !== "ListStart") {
    throw "pokaLexerTestList: Expected: [ Got: " + pokaLexerShowLexeme(t1);
  }
  const t2 = pokaLexerPopNumber(state);
  if (t2.value !== 1) {
    throw "pokaLexerTestList: Expected: 1 Got: " + t2.value;
  }
  const t3 = pokaLexerPopComma(state);
  if (t3._kind !== "Comma") {
    throw "pokaLexerTestList: Expected: , Got: " + pokaLexerShowLexeme(t3);
  }
  const t4 = pokaLexerPopNumber(state);
  if (t4.value !== 2) {
    throw "pokaLexerTestList: Expected: 2 Got: " + t4.value;
  }
  const t5 = pokaLexerPopListEnd(state);
  if (t5._kind !== "ListEnd") {
    throw "pokaLexerTestList: Expected: ] Got: " + pokaLexerShowLexeme(t5);
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestList: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerTestSigil(): void {
  const state = pokaLex('"hi" =a $a');
  if (state.error !== undefined) {
    throw "pokaLexerTestSigil: " + state.error;
  }
  const t1 = pokaLexerPopString(state);
  if (t1.text !== "hi") {
    throw 'pokaLexerTestSigil: Expected: "hi" Got: "' + t1.text + '"';
  }
  const t2 = pokaLexerPopSigilIdentifier(state);
  if (t2.sigil !== "=" || t2.value !== "a") {
    throw "pokaLexerTestSigil: Expected: =a Got: " + pokaLexerShowLexeme(t2);
  }
  const t3 = pokaLexerPopSigilIdentifier(state);
  if (t3.sigil !== "$" || t3.value !== "a") {
    throw "pokaLexerTestSigil: Expected: $a Got: " + pokaLexerShowLexeme(t3);
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestSigil: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerTestForm(): void {
  const state = pokaLex("FOR x EACH");
  if (state.error !== undefined) {
    throw "pokaLexerTestForm: " + state.error;
  }
  const t1 = pokaLexerPopForm(state);
  if (t1.text !== "FOR") {
    throw "pokaLexerTestForm: Expected: FOR Got: " + t1.text;
  }
  const t2 = pokaLexerPopPlainIdentifer(state);
  if (t2.text !== "x") {
    throw "pokaLexerTestForm: Expected: x Got: " + t2.text;
  }
  const t3 = pokaLexerPopForm(state);
  if (t3.text !== "EACH") {
    throw "pokaLexerTestForm: Expected: EACH Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestForm: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerTestFloat(): void {
  const state = pokaLex("-1.5 3.2 mul");
  if (state.error !== undefined) {
    throw "pokaLexerTestFloat: " + state.error;
  }
  const t1 = pokaLexerPopNumber(state);
  if (t1.value !== -1.5) {
    throw "pokaLexerTestFloat: Expected: -1.5 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(state);
  if (t2.value !== 3.2) {
    throw "pokaLexerTestFloat: Expected: 3.2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(state);
  if (t3.text !== "mul") {
    throw "pokaLexerTestFloat: Expected: mul Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestFloat: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerTestWhitespace(): void {
  const state = pokaLex("1   2   add");
  if (state.error !== undefined) {
    throw "pokaLexerTestWhitespace: " + state.error;
  }
  const t1 = pokaLexerPopNumber(state);
  if (t1.value !== 1) {
    throw "pokaLexerTestWhitespace: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(state);
  if (t2.value !== 2) {
    throw "pokaLexerTestWhitespace: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(state);
  if (t3.text !== "add") {
    throw "pokaLexerTestWhitespace: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestWhitespace: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerTestNewline(): void {
  const state = pokaLex("1\n 2 add");
  if (state.error !== undefined) {
    throw "pokaLexerTestNewline: " + state.error;
  }
  const t1 = pokaLexerPopNumber(state);
  if (t1.value !== 1) {
    throw "pokaLexerTestNewline: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(state);
  if (t2.value !== 2) {
    throw "pokaLexerTestNewline: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(state);
  if (t3.text !== "add") {
    throw "pokaLexerTestNewline: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestNewline: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerTestTabs(): void {
  const state = pokaLex("1\t\n 2\tadd");
  if (state.error !== undefined) {
    throw "pokaLexerTestTabs: " + state.error;
  }
  const t1 = pokaLexerPopNumber(state);
  if (t1.value !== 1) {
    throw "pokaLexerTestTabs: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(state);
  if (t2.value !== 2) {
    throw "pokaLexerTestTabs: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(state);
  if (t3.text !== "add") {
    throw "pokaLexerTestTabs: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(state)) {
    throw (
      "pokaLexerTestTabs: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(state))
    );
  }
}

function pokaLexerRunTests(): string {
  const result: string[] = [];
  try {
    pokaLexerTestSimple();
    pokaLexerTestList();
    pokaLexerTestSigil();
    pokaLexerTestForm();
    pokaLexerTestFloat();
    pokaLexerTestWhitespace();
    pokaLexerTestNewline();
    pokaLexerTestTabs();
    result.push("pokaLexerRunTests: OK");
  } catch (exc) {
    result.push(String(exc));
  }
  return result.join("\n");
}
