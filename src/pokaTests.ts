function pokaTest(expr: string): void {
  const state = run(expr);
  const top = state.stack.pop();
  if (top === undefined) {
    throw "Stack exhausted";
  }
  if (top._type !== "ScalarBoolean") {
    throw "Test has non-boolean result";
  }
  if (top.value !== true) {
    throw "Test failed";
  }
}

pokaTest(
  '"1 2 3,4 5 6" "," split " " split toDouble [0 col transpose, -1 col transpose] [[1, 4], [3, 6]] equals',
);

pokaTest("[[1, 2], [2, 1]] sortCols [[1, 1], [2, 2]] equals");

pokaTest(
  '"1 4,2 3,3 2" "," split " " split toDouble sortCols spreadCols sub abs sum 3 equals',
);
