const POKA_TESTS = [
  '"1 2 3" " " split ["1", "2", "3"] equals all',
  '"1 2 3,4 5 6" "," split " " split [["1", "2", "3"], ["4", "5", "6"]] equals all',
  '"1 2 3,4 5 6" "," split " " split toNumber [0 col, -1 col] [[1, 4], [3, 6]] equals all',
  "[[1, 2], [2, 1]] sortCols [[1, 1], [2, 2]] equals all",
  "[[1, 2, 3], [4, 5, 6]] transpose [[1, 4], [2, 5], [3, 6]] equals all",
  '"1 4,2 3,3 2" "," split " " split toNumber sortCols [0 col, 1 col] spread sub abs sum 3 equals',
];

function pokaTestsRun(): string {
  const result: string[] = [];
  for (const expr of POKA_TESTS) {
    try {
      const state = run(expr);
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
      result.push("OK   | " + expr);
    } catch (exc) {
      result.push("FAIL | " + expr);
      result.push("EXC  | " + exc);
    }
  }
  return result.join("\n");
}

function pokaDocTestsRun(): string {
  const result: string[] = [];
  for (const [_, decl] of Object.entries(POKA_WORDS2.pokaVectorBooleanToScalarBoolean)) {
    for (const line of decl.doc) {
      try {
        const state = run(line);
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
        result.push("OK   | " + line);
      } catch (exc) {
        result.push("FAIL | " + line);
        result.push(" EXC | " + exc);
      }
    }
  }
  return result.join("\n");
}

function pokaTestsShow(): void {
  const elem = document.getElementById("poka_test_results");
  if (elem === null) {
    throw "Test output div not found";
  }
  elem.innerText = pokaTestsRun() + "\n" + pokaDocTestsRun();
}

pokaTestsShow();
