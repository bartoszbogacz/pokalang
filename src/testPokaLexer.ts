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
      { _kind: "Identifier", text: "add" },
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
      { _kind: "Identifier", text: "=a" },
      { _kind: "Identifier", text: "$a" },
    ],
  },
  {
    text: "FOR x EACH",
    lexemes: [
      { _kind: "Form", text: "FOR" },
      { _kind: "Identifier", text: "x" },
      { _kind: "Form", text: "EACH" },
    ],
  },
  {
    text: "-1.5 3.2 mul",
    lexemes: [
      { _kind: "Number", text: "-1.5" },
      { _kind: "Number", text: "3.2" },
      { _kind: "Identifier", text: "mul" },
    ],
  },
  {
    text: "1   2   add",
    lexemes: [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "Identifier", text: "add" },
    ],
  },
  {
    text: "1\n 2 add",
    lexemes: [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "Identifier", text: "add" },
    ],
  },
  {
    text: "1\t\n 2\tadd",
    lexemes: [
      { _kind: "Number", text: "1" },
      { _kind: "Number", text: "2" },
      { _kind: "Identifier", text: "add" },
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
        case "Identifier":
          pokaLexerPopIdentifier(state);
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
