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

interface PokaLexemeSymbol {
  _kind: "Symbol";
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

const POKA_LEXER_SYMBOLS = "{}()";

type PokaLexeme =
  | PokaLexemeNumber
  | PokaLexemeString
  | PokaLexemePlainIdentifier
  | PokaLexemeSigilIdentifier
  | PokaLexemeForm
  | PokaLexemeComma
  | PokaLexemeSymbol
  | PokaLexemeListStart
  | PokaLexemeListEnd;

interface PokaLexerState {
  line: string;
  pos: number;
  lexemes: PokaLexeme[];
  error?: string;
  tail?: string;
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

function pokaLexerIsSymbol(state: PokaLexerState): boolean {
  return POKA_LEXER_SYMBOLS.includes(state.line.charAt(state.pos));
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

function pokaLexerConsumeSymbol(state: PokaLexerState): void {
  const c = state.line.charAt(state.pos);
  state.lexemes.push({ _kind: "Symbol", text: c });
  state.pos++;
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
    state.error = "Invalid number";
    state.tail = state.line.slice(start);
    return;
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
    text: value,
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

function pokaLexerCheckMissingWhitespace(
  state: PokaLexerState,
  consumed: number,
): boolean {
  if (!pokaLexerIsEol(state) && consumed === 0) {
    const prev = state.lexemes[state.lexemes.length - 1]!;
    const nextChar = state.line.charAt(state.pos);
    const prevJoinable =
      prev._kind === "Comma" ||
      (prev._kind === "Symbol" && POKA_LEXER_SYMBOLS.includes(prev.text)) ||
      prev._kind === "ListStart" ||
      prev._kind === "ListEnd";
    const nextJoinable =
      nextChar === "," ||
      POKA_LEXER_SYMBOLS.includes(nextChar) ||
      nextChar === "[" ||
      nextChar === "]";
    if (!prevJoinable && !nextJoinable) {
      state.error = "Missing whitespace";
      state.tail = state.line.slice(state.pos);
      return true;
    }
  }
  return false;
}

function pokaLexerLex(line: string): PokaLexerState {
  const state: PokaLexerState = { line, pos: 0, lexemes: [] };
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
    } else if (pokaLexerIsSymbol(state)) {
      pokaLexerConsumeSymbol(state);
    } else {
      state.error = "Unknown token";
      state.tail = state.line.slice(state.pos);
      break;
    }
    const consumed = pokaLexerConsumeWhitespace(state);
    if (pokaLexerCheckMissingWhitespace(state, consumed)) {
      break;
    }
  }
  if (!state.error && !pokaLexerIsEol(state)) {
    state.tail = state.line.slice(state.pos);
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
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "Number") {
    throw "Unexpected token";
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopString(cursor: PokaLexerCursor): PokaLexemeString {
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "String") {
    throw "Unexpected token";
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopPlainIdentifer(
  cursor: PokaLexerCursor,
): PokaLexemePlainIdentifier {
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "PlainIdentifier") {
    throw "Unexpected token";
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopSigilIdentifier(
  cursor: PokaLexerCursor,
): PokaLexemeSigilIdentifier {
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "SigilIdentifier") {
    throw "Unexpected token";
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopForm(cursor: PokaLexerCursor): PokaLexemeForm {
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "Form") {
    throw "Unexpected token";
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopComma(cursor: PokaLexerCursor): PokaLexemeComma {
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "Comma") {
    throw "Unexpected token";
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopListStart(cursor: PokaLexerCursor): PokaLexemeListStart {
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "ListStart") {
    throw "Unexpected token";
  }
  cursor.pos++;
  return lex;
}

function pokaLexerPopListEnd(cursor: PokaLexerCursor): PokaLexemeListEnd {
  const lex = pokaLexerPeek(cursor);
  if (lex._kind !== "ListEnd") {
    throw "Unexpected token";
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
    case "Symbol":
      return lex.text;
    case "ListStart":
      return "[";
    case "ListEnd":
      return "]";
  }
}

const POKA_LEXER_TESTS: [string, PokaLexeme[]][] = [
  [
    "1 2 add",
    [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  ],
  [
    "[1, 2]",
    [
      { _kind: "ListStart" },
      { _kind: "Number", value: 1 },
      { _kind: "Comma" },
      { _kind: "Number", value: 2 },
      { _kind: "ListEnd" },
    ],
  ],
  [
    '"hi" =a $a',
    [
      { _kind: "String", text: "hi" },
      { _kind: "SigilIdentifier", sigil: "=", value: "a" },
      { _kind: "SigilIdentifier", sigil: "$", value: "a" },
    ],
  ],
  [
    "FOR x EACH",
    [
      { _kind: "Form", text: "FOR" },
      { _kind: "PlainIdentifier", text: "x" },
      { _kind: "Form", text: "EACH" },
    ],
  ],
  [
    "-1.5 3.2 mul",
    [
      { _kind: "Number", value: -1.5 },
      { _kind: "Number", value: 3.2 },
      { _kind: "PlainIdentifier", text: "mul" },
    ],
  ],
  [
    "1   2   add",
    [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  ],
  [
    "1\n 2 add",
    [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  ],
  [
    "1\t\n 2\tadd",
    [
      { _kind: "Number", value: 1 },
      { _kind: "Number", value: 2 },
      { _kind: "PlainIdentifier", text: "add" },
    ],
  ],
];

const POKA_LEXER_NEGATIVE_TESTS: string[] = [
  "1add",
  "1 2add",
  "FORx EACH",
  "-1.5mul",
  "1.5$a",
  '"hi"=a',
  '"hi"$a',
];

function pokaLexerTestsRun(): string {
  const result: string[] = [];
  for (const [text, expected] of POKA_LEXER_TESTS) {
    try {
      const state = pokaLexerLex(text);
      let ok =
        state.error === undefined && state.lexemes.length === expected.length;
      if (ok) {
        for (let i = 0; i < expected.length; i++) {
          const got = state.lexemes[i]!;
          const exp = expected[i]!;
          if (got._kind !== exp._kind) {
            ok = false;
            break;
          }
          if (got._kind === "Number") {
            const g = got as PokaLexemeNumber;
            const e = exp as PokaLexemeNumber;
            if (g.value !== e.value) {
              ok = false;
              break;
            }
          } else if (got._kind === "SigilIdentifier") {
            const g = got as PokaLexemeSigilIdentifier;
            const e = exp as PokaLexemeSigilIdentifier;
            if (g.sigil !== e.sigil || g.value !== e.value) {
              ok = false;
              break;
            }
          } else {
            if ((got as any).text !== (exp as any).text) {
              ok = false;
              break;
            }
          }
        }
      }
      if (!ok) {
        throw "Unexpected lexemes: " + JSON.stringify(state.lexemes);
      }
      result.push("OK   | " + text.replace("\n", "\\n"));
    } catch (exc) {
      result.push("FAIL | " + text.replace("\n", "\\n"));
      result.push(" EXC | " + exc);
    }
  }
  for (const text of POKA_LEXER_NEGATIVE_TESTS) {
    try {
      const state = pokaLexerLex(text);
      if (state.error === undefined && state.tail === undefined) {
        throw "Unexpected success";
      }
      result.push("OK   | " + text.replace("\n", "\\n"));
    } catch (exc) {
      result.push("FAIL | " + text.replace("\n", "\\n"));
      result.push(" EXC | " + exc);
    }
  }
  return result.join("\n");
}
