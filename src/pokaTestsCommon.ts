const POKA_TESTS = [
  '"1 2 3,4 5 6" "," split " " split [["1", "2", "3"], ["4", "5", "6"]] equals all',
  '"1 2 3,4 5 6" "," split " " split toNumber [0 cols, -1 cols] [[1, 4], [3, 6]] equals all',
  '"1 4,2 3,3 2" "," split " " split toNumber sortCols [0 cols, 1 cols] spread sub abs sum 3 equals',
  "1 =a 2 =b $b $a sub 1 equals",
  '"Hello" =a [$a 1 entry] $a get 1 equals',
  '"Hello" =a [$a 1 entry] $a 2 entry set $a get 2 equals',
];

function pokaTestsRun(): string {
  const result: string[] = [];
  result.push(...pokaLexerTestsRun().split("\n"));
  for (const expr of POKA_TESTS) {
    try {
      const state = pokaInterpreterMake(expr, {});
      pokaInterpreterEvaluate(state);
      const top = state.stack.pop();
      if (top === undefined) {
        throw "Stack exhausted";
      }
      if (top._type !== "ScalarBoolean") {
        throw "Test has non-boolean result: " + pokaShow(top);
      }
      if (top.value !== true) {
        throw "Test failed";
      }
      result.push("OK   | " + expr.replace("\n", "\\n"));
    } catch (exc) {
      result.push("FAIL | " + expr.replace("\n", "\\n"));
      result.push("EXC  | " + exc);
    }
  }
  return result.join("\n");
}

function pokaDocTests4Run(): string {
  const result: string[] = [];
  for (const [_, decl] of Object.entries(POKA_WORDS4)) {
    for (const line of decl.doc) {
      try {
        const state = pokaInterpreterMake(line, {});
        pokaInterpreterEvaluate(state);
        const top = state.stack.pop();
        if (top === undefined) {
          throw "Stack exhausted";
        }
        if (top._type !== "ScalarBoolean") {
          throw "Test has non-boolean result: " + pokaShow(top);
        }
        if (top.value !== true) {
          throw "Test failed";
        }
        result.push("OK   | " + line.replace("\n", "\\n"));
      } catch (exc) {
        result.push("FAIL | " + line.replace("\n", "\\n"));
        result.push(" EXC | " + exc);
      }
    }
  }
  return result.join("\n");
}

function pokaTestsAocRun(): string {
  const result: string[] = [];
  for (const [_, day] of Object.entries(AOC2025)) {
    for (const line of day.program) {
      try {
        const env: { [word: string]: PokaValue } = {
          [day.input_name]: pokaScalarStringMake(day.input_text),
        };
        const state = pokaInterpreterMake(line, env);
        pokaInterpreterEvaluate(state);
        const top = state.stack.pop();
        if (top === undefined) {
          throw "Stack exhausted";
        }
        if (top._type !== "ScalarNumber") {
          throw "Test has non ScalarNumber result: " + pokaShow(top);
        }
        if (top.value !== day.answer) {
          throw "Test failed";
        }
        result.push("OK   | " + line.replace("\n", "\\n"));
      } catch (exc) {
        result.push("FAIL | " + line.replace("\n", "\\n"));
        result.push(" EXC | " + exc);
      }
    }
  }
  return result.join("\n");
}
