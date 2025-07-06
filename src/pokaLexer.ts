interface PokaLexemeNumber {
  _kind: "Number";
  text: string;
}

interface PokaLexemeString {
  _kind: "String";
  text: string;
}

interface PokaLexemeIdentifier {
  _kind: "Identifier";
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

const POKA_LEXER_SYMBOLS = "[]{}(),=$";

type PokaLexeme =
  | PokaLexemeNumber
  | PokaLexemeString
  | PokaLexemeIdentifier
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

function pokaLexerIsLower(c: string): boolean {
  return c >= "a" && c <= "z";
}

function pokaLexerIsUpper(c: string): boolean {
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

function pokaLexerConsumeWhitespace(state: PokaLexerState): void {
  while (state.line.charAt(state.pos) === " ") {
    state.pos++;
  }
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

function pokaLexerConsumeIdentifier(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++;
  while (
    pokaLexerIsLower(state.line.charAt(state.pos)) ||
    pokaLexerIsUpper(state.line.charAt(state.pos)) ||
    pokaLexerIsDigit(state.line.charAt(state.pos))
  ) {
    state.pos++;
  }
  state.lexemes.push({
    _kind: "Identifier",
    text: state.line.slice(start, state.pos),
  });
}

function pokaLexerConsumeForm(state: PokaLexerState): void {
  const start = state.pos;
  state.pos++;
  while (pokaLexerIsUpper(state.line.charAt(state.pos))) {
    state.pos++;
  }
  state.lexemes.push({
    _kind: "Form",
    text: state.line.slice(start, state.pos),
  });
}

function pokaLexerLex(line: string): PokaLexerState {
  const state: PokaLexerState = { line, pos: 0, lexemes: [] };
  while (!pokaLexerIsEol(state)) {
    pokaLexerConsumeWhitespace(state);
    if (pokaLexerIsEol(state)) {
      break;
    }
    const c = state.line.charAt(state.pos);
    if (pokaLexerIsNumberStart(state)) {
      pokaLexerConsumeNumber(state);
    } else if (pokaLexerIsStringStart(state)) {
      pokaLexerConsumeString(state);
    } else if (pokaLexerIsLower(c)) {
      pokaLexerConsumeIdentifier(state);
    } else if (pokaLexerIsUpper(c)) {
      pokaLexerConsumeForm(state);
    } else if (POKA_LEXER_SYMBOLS.includes(c)) {
      pokaLexerConsumeSymbol(state);
    } else {
      state.error = "Unknown token";
      state.tail = state.line.slice(state.pos);
      break;
    }
    pokaLexerConsumeWhitespace(state);
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
      { _kind: "Identifier", text: "add" },
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
      { _kind: "Symbol", text: "=" },
      { _kind: "Identifier", text: "a" },
      { _kind: "Symbol", text: "$" },
      { _kind: "Identifier", text: "a" },
    ],
  ],
  [
    "FOR x EACH",
    [
      { _kind: "Form", text: "FOR" },
      { _kind: "Identifier", text: "x" },
      { _kind: "Form", text: "EACH" },
    ],
  ],
  [
    "-1.5 3.2 mul",
    [
      { _kind: "Number", text: "-1.5" },
      { _kind: "Number", text: "3.2" },
      { _kind: "Identifier", text: "mul" },
    ],
  ],
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
  return result.join("\n");
}
