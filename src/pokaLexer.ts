interface PokaLexemeNumber {
  _kind: "Number";
  text: string;
}

interface PokaLexemeString {
  _kind: "String";
  text: string;
}


interface PokaLexemeWordIdentifier {
  _kind: "WordIdentifier";
  text: string;
}

interface PokaLexemeReadIdentifier {
  _kind: "ReadIdentifier";
  text: string;
}

interface PokaLexemeWriteIdentifier {
  _kind: "WriteIdentifier";
  text: string;
}

interface PokaLexemeForm {
  _kind: "Form";
  text: string;
}

interface PokaLexemeSymbol {
  _kind: "Symbol";
  text: string;
}

const POKA_LEXER_SYMBOLS = "[]{}(),";

type PokaLexeme =
  | PokaLexemeNumber
  | PokaLexemeString
  | PokaLexemeWordIdentifier
  | PokaLexemeReadIdentifier
  | PokaLexemeWriteIdentifier
  | PokaLexemeForm
  | PokaLexemeSymbol;

interface PokaLexerState {
  line: string;
  pos: number;
  lexemes: PokaLexeme[];
  error?: string;
  tail?: string;
}

function pokaLexerIsDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function pokaLexerIsWordIdentifier(state: PokaLexerState): boolean {
  const c = state.line.charAt(state.pos);
  return c >= "a" && c <= "z";
}

function pokaLexerIsReadIdentifierStart(state: PokaLexerState): boolean {
  return state.line.charAt(state.pos) === "$";
}

function pokaLexerIsWriteIdentifierStart(state: PokaLexerState): boolean {
  return state.line.charAt(state.pos) === "=";
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
  state.lexemes.push({
    _kind: "Number",
    text: state.line.slice(start, state.pos),
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

function pokaLexerConsumeWordIdentifier(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++;
  while (
    pokaLexerIsWordIdentifier(state) ||
    pokaLexerIsForm(state) ||
    pokaLexerIsDigit(state.line.charAt(state.pos))
  ) {
    state.pos++;
  }
  state.lexemes.push({
    _kind: "WordIdentifier",
    text: state.line.slice(start, state.pos),
  });
}

function pokaLexerConsumeReadIdentifier(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++; // consume '$'
  while (
    pokaLexerIsWordIdentifier(state) ||
    pokaLexerIsForm(state) ||
    pokaLexerIsDigit(state.line.charAt(state.pos))
  ) {
    state.pos++;
  }
  state.lexemes.push({
    _kind: "ReadIdentifier",
    text: state.line.slice(start, state.pos),
  });
}

function pokaLexerConsumeWriteIdentifier(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++; // consume '='
  while (
    pokaLexerIsWordIdentifier(state) ||
    pokaLexerIsForm(state) ||
    pokaLexerIsDigit(state.line.charAt(state.pos))
  ) {
    state.pos++;
  }
  state.lexemes.push({
    _kind: "WriteIdentifier",
    text: state.line.slice(start, state.pos),
  });
}

function pokaLexerConsumeForm(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++;
  while (pokaLexerIsForm(state)) {
    state.pos++;
  }
  state.lexemes.push({
    _kind: "Form",
    text: state.line.slice(start, state.pos),
  });
}

function pokaLexerCheckMissingWhitespace(
  state: PokaLexerState,
  consumed: number
): boolean {
  if (!pokaLexerIsEol(state) && consumed === 0) {
    const prev = state.lexemes[state.lexemes.length - 1]!;
    const nextChar = state.line.charAt(state.pos);
    const prevJoinable =
      prev._kind === "Symbol" && POKA_LEXER_SYMBOLS.includes(prev.text);
    if (!prevJoinable && !POKA_LEXER_SYMBOLS.includes(nextChar)) {
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
    } else if (pokaLexerIsReadIdentifierStart(state)) {
      pokaLexerConsumeReadIdentifier(state);
    } else if (pokaLexerIsWriteIdentifierStart(state)) {
      pokaLexerConsumeWriteIdentifier(state);
    } else if (pokaLexerIsWordIdentifier(state)) {
      pokaLexerConsumeWordIdentifier(state);
    } else if (pokaLexerIsForm(state)) {
      pokaLexerConsumeForm(state);
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

const POKA_LEXER_TESTS: [string, PokaLexeme[]][] = [
  [
    "1 2 add",
    [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "WordIdentifier", text: "add" },
    ],
  ],
  [
    "[1, 2]",
    [
      { _kind: "Symbol", text: "[" },
      { _kind: "Number", text: "1" },
      { _kind: "Symbol", text: "," },
      { _kind: "Number", text: "2" },
      { _kind: "Symbol", text: "]" },
    ],
  ],
  [
    '"hi" =a $a',
    [
      { _kind: "String", text: "hi" },
      { _kind: "WriteIdentifier", text: "=a" },
      { _kind: "ReadIdentifier", text: "$a" },
    ],
  ],
  [
    "FOR x EACH",
    [
      { _kind: "Form", text: "FOR" },
      { _kind: "WordIdentifier", text: "x" },
      { _kind: "Form", text: "EACH" },
    ],
  ],
  [
    "-1.5 3.2 mul",
    [
      { _kind: "Number", text: "-1.5" },
      { _kind: "Number", text: "3.2" },
      { _kind: "WordIdentifier", text: "mul" },
    ],
  ],
  [
    "1   2   add",
    [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "WordIdentifier", text: "add" },
    ],
  ],
  [
    "1\n 2 add",
    [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "WordIdentifier", text: "add" },
    ],
  ],
  [
    "1\t\n 2\tadd",
    [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "WordIdentifier", text: "add" },
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
      let ok = state.error === undefined && state.lexemes.length === expected.length;
      if (ok) {
        for (let i = 0; i < expected.length; i++) {
          const got = state.lexemes[i]!;
          const exp = expected[i]!;
          if (got._kind !== exp._kind || got.text !== exp.text) {
            ok = false;
            break;
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
