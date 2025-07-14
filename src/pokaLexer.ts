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
  pos: number;
  lexemes: PokaLexeme[];
  error?: string;
}

interface PokaLexerCursor {
  lexemes: PokaLexeme[];
  pos: number;
}

function pokaLexerIsDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function pokaLexerIsPlainIdentifierStart(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.pos);
  return c >= "a" && c <= "z";
}

function pokaLexerIsSigilIdentifierStart(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.pos);
  return c === "$" || c === "=";
}

function pokaLexerIsForm(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.pos);
  return c >= "A" && c <= "Z";
}

function pokaLexerIsEol(state: PokaLexerState): boolean {
  return state.pos >= state.line.length;
}

function pokaLexerIsNumberStart(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.pos);
  return (
    pokaLexerIsDigit(c) ||
    (c === "-" && pokaLexerIsDigit(state.line.charAt(state.pos + 1)))
  );
}

function pokaLexerIsStringStart(state: PokaLexerState): boolean {
  return state.line.charAt(state.pos) === '"';
}

function pokaLexerIsComma(state: PokaLexerState): boolean {
  return state.line.charAt(state.pos) === ",";
}

function pokaLexerIsListStart(state: PokaLexerState): boolean {
  return state.line.charAt(state.pos) === "[";
}

function pokaLexerIsListEnd(state: PokaLexerState): boolean {
  return state.line.charAt(state.pos) === "]";
}

function pokaLexerConsumeWhitespace(state: PokaLexerState): number {
  let count = 0;
  while (true) {
    const c = state.line.charAt(state.pos);
    if (c === " " || c === "\n" || c === "\t") {
      state.pos++;
      count++;
    } else {
      break;
    }
  }
  return count;
}

function pokaLexerConsumeComma(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "Comma" });
  state.pos++;
}

function pokaLexerConsumeListStart(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "ListStart" });
  state.pos++;
}

function pokaLexerConsumeListEnd(state: PokaLexerState): void {
  state.lexemes.push({ _kind: "ListEnd" });
  state.pos++;
}

function pokaLexerConsumeNumber(state: PokaLexerState): void {
  const start = state.pos;
  if (state.line.charAt(state.pos) === "-") {
    state.pos++;
  }
  while (pokaLexerIsDigit(state.line.charAt(state.pos))) {
    state.pos++;
  }
  if (state.line.charAt(state.pos) === ".") {
    state.pos++;
    while (pokaLexerIsDigit(state.line.charAt(state.pos))) {
      state.pos++;
    }
  }
  const text = state.line.slice(start, state.pos);
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
  state.pos++; // opening quote
  const start = state.pos;
  while (
    state.pos < state.line.length &&
    state.line.charAt(state.pos) !== '"'
  ) {
    state.pos++;
  }
  const value = state.line.slice(start, state.pos);
  state.pos++; // closing quote
  state.lexemes.push({
    _kind: "String",
    text: value.replace(/\\n/g, "\n"),
  });
}

function pokaLexerConsumePlainIdentifier(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++;
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
  state.lexemes.push({
    _kind: "PlainIdentifier",
    text: state.line.slice(start, state.pos),
  });
}

function pokaLexerConsumeSigilIdentifier(state: PokaLexerState): void {
  const sigil = state.line.charAt(state.pos);
  state.pos++; // consume sigil
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
  state.lexemes.push({
    _kind: "SigilIdentifier",
    sigil,
    value: state.line.slice(start, state.pos),
  });
}

function pokaLexerConsumeForm(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++;
  while (true) {
    const c = state.line.charAt(state.pos);
    if (c >= "A" && c <= "Z") {
      state.pos++;
    } else {
      break;
    }
  }
  state.lexemes.push({
    _kind: "Form",
    text: state.line.slice(start, state.pos),
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
    pos: 0,
    lexemes: [],
  };
  try {
    pokaLexerConsume(state);
  } catch (exc) {
    state.error = "" + exc;
  }
  return state;
}

function pokaLexerPeek(cursor: PokaLexerCursor): PokaLexeme {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Unexpected end of input";
  }
  return lex;
}

function pokaLexerPeekEOL(cursor: PokaLexerCursor): boolean {
  return cursor.pos >= cursor.lexemes.length;
}

function pokaLexerPopNumber(cursor: PokaLexerCursor): PokaLexemeNumber {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: Number Got: End of input.";
  }
  if (lex._kind !== "Number") {
    throw "Expected: Number Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopString(cursor: PokaLexerCursor): PokaLexemeString {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: String Got: End of input.";
  }
  if (lex._kind !== "String") {
    throw "Expected: String Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopPlainIdentifer(
  cursor: PokaLexerCursor,
): PokaLexemePlainIdentifier {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: PlainIdentifier Got: End of input.";
  }
  if (lex._kind !== "PlainIdentifier") {
    throw "Expected: PlainIdentifier Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopSigilIdentifier(
  cursor: PokaLexerCursor,
): PokaLexemeSigilIdentifier {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: SigilIdentifier Got: End of input.";
  }
  if (lex._kind !== "SigilIdentifier") {
    throw "Expected: SigilIdentifier Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopForm(cursor: PokaLexerCursor): PokaLexemeForm {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: Form Got: End of input.";
  }
  if (lex._kind !== "Form") {
    throw "Expected: Form Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopComma(cursor: PokaLexerCursor): PokaLexemeComma {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: Comma Got: End of input.";
  }
  if (lex._kind !== "Comma") {
    throw "Expected: Comma Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopListStart(cursor: PokaLexerCursor): PokaLexemeListStart {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: ListStart Got: End of input.";
  }
  if (lex._kind !== "ListStart") {
    throw "Expected: ListStart Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopListEnd(cursor: PokaLexerCursor): PokaLexemeListEnd {
  const lex = cursor.lexemes[cursor.pos];
  if (lex === undefined) {
    throw "Expected: ListEnd Got: End of input.";
  }
  if (lex._kind !== "ListEnd") {
    throw "Expected: ListEnd Got: " + pokaLexerShowLexeme(lex);
  }
  cursor.pos++;
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
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopNumber(cursor);
  if (t1.value !== 1) {
    throw "pokaLexerTestSimple: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(cursor);
  if (t2.value !== 2) {
    throw "pokaLexerTestSimple: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(cursor);
  if (t3.text !== "add") {
    throw "pokaLexerTestSimple: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestSimple: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
    );
  }
}

function pokaLexerTestList(): void {
  const state = pokaLex("[1, 2]");
  if (state.error !== undefined) {
    throw "pokaLexerTestList: " + state.error;
  }
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopListStart(cursor);
  if (t1._kind !== "ListStart") {
    throw "pokaLexerTestList: Expected: [ Got: " + pokaLexerShowLexeme(t1);
  }
  const t2 = pokaLexerPopNumber(cursor);
  if (t2.value !== 1) {
    throw "pokaLexerTestList: Expected: 1 Got: " + t2.value;
  }
  const t3 = pokaLexerPopComma(cursor);
  if (t3._kind !== "Comma") {
    throw "pokaLexerTestList: Expected: , Got: " + pokaLexerShowLexeme(t3);
  }
  const t4 = pokaLexerPopNumber(cursor);
  if (t4.value !== 2) {
    throw "pokaLexerTestList: Expected: 2 Got: " + t4.value;
  }
  const t5 = pokaLexerPopListEnd(cursor);
  if (t5._kind !== "ListEnd") {
    throw "pokaLexerTestList: Expected: ] Got: " + pokaLexerShowLexeme(t5);
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestList: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
    );
  }
}

function pokaLexerTestSigil(): void {
  const state = pokaLex('"hi" =a $a');
  if (state.error !== undefined) {
    throw "pokaLexerTestSigil: " + state.error;
  }
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopString(cursor);
  if (t1.text !== "hi") {
    throw 'pokaLexerTestSigil: Expected: "hi" Got: "' + t1.text + '"';
  }
  const t2 = pokaLexerPopSigilIdentifier(cursor);
  if (t2.sigil !== "=" || t2.value !== "a") {
    throw "pokaLexerTestSigil: Expected: =a Got: " + pokaLexerShowLexeme(t2);
  }
  const t3 = pokaLexerPopSigilIdentifier(cursor);
  if (t3.sigil !== "$" || t3.value !== "a") {
    throw "pokaLexerTestSigil: Expected: $a Got: " + pokaLexerShowLexeme(t3);
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestSigil: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
    );
  }
}

function pokaLexerTestForm(): void {
  const state = pokaLex("FOR x EACH");
  if (state.error !== undefined) {
    throw "pokaLexerTestForm: " + state.error;
  }
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopForm(cursor);
  if (t1.text !== "FOR") {
    throw "pokaLexerTestForm: Expected: FOR Got: " + t1.text;
  }
  const t2 = pokaLexerPopPlainIdentifer(cursor);
  if (t2.text !== "x") {
    throw "pokaLexerTestForm: Expected: x Got: " + t2.text;
  }
  const t3 = pokaLexerPopForm(cursor);
  if (t3.text !== "EACH") {
    throw "pokaLexerTestForm: Expected: EACH Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestForm: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
    );
  }
}

function pokaLexerTestFloat(): void {
  const state = pokaLex("-1.5 3.2 mul");
  if (state.error !== undefined) {
    throw "pokaLexerTestFloat: " + state.error;
  }
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopNumber(cursor);
  if (t1.value !== -1.5) {
    throw "pokaLexerTestFloat: Expected: -1.5 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(cursor);
  if (t2.value !== 3.2) {
    throw "pokaLexerTestFloat: Expected: 3.2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(cursor);
  if (t3.text !== "mul") {
    throw "pokaLexerTestFloat: Expected: mul Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestFloat: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
    );
  }
}

function pokaLexerTestWhitespace(): void {
  const state = pokaLex("1   2   add");
  if (state.error !== undefined) {
    throw "pokaLexerTestWhitespace: " + state.error;
  }
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopNumber(cursor);
  if (t1.value !== 1) {
    throw "pokaLexerTestWhitespace: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(cursor);
  if (t2.value !== 2) {
    throw "pokaLexerTestWhitespace: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(cursor);
  if (t3.text !== "add") {
    throw "pokaLexerTestWhitespace: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestWhitespace: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
    );
  }
}

function pokaLexerTestNewline(): void {
  const state = pokaLex("1\n 2 add");
  if (state.error !== undefined) {
    throw "pokaLexerTestNewline: " + state.error;
  }
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopNumber(cursor);
  if (t1.value !== 1) {
    throw "pokaLexerTestNewline: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(cursor);
  if (t2.value !== 2) {
    throw "pokaLexerTestNewline: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(cursor);
  if (t3.text !== "add") {
    throw "pokaLexerTestNewline: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestNewline: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
    );
  }
}

function pokaLexerTestTabs(): void {
  const state = pokaLex("1\t\n 2\tadd");
  if (state.error !== undefined) {
    throw "pokaLexerTestTabs: " + state.error;
  }
  const cursor: PokaLexerCursor = { lexemes: state.lexemes, pos: 0 };
  const t1 = pokaLexerPopNumber(cursor);
  if (t1.value !== 1) {
    throw "pokaLexerTestTabs: Expected: 1 Got: " + t1.value;
  }
  const t2 = pokaLexerPopNumber(cursor);
  if (t2.value !== 2) {
    throw "pokaLexerTestTabs: Expected: 2 Got: " + t2.value;
  }
  const t3 = pokaLexerPopPlainIdentifer(cursor);
  if (t3.text !== "add") {
    throw "pokaLexerTestTabs: Expected: add Got: " + t3.text;
  }
  if (!pokaLexerPeekEOL(cursor)) {
    throw (
      "pokaLexerTestTabs: Unexpected token: " +
      pokaLexerShowLexeme(pokaLexerPeek(cursor))
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
