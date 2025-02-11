function wordAbs(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "`abs` requires two arguments";
  }
  if (a._type === "ScalarDouble") {
    stack.push(pokaMakeScalarDouble(Math.abs(a.value)));
  } else if (a._type === "MatrixDouble") {
    stack.push(pokaMakeMatrixDouble(a.value.abs()));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a], "abs"));
  }
}

function wordAdd(stack: PokaValue[]): void {
  const a = stack.pop();
  const b = stack.pop();

  if (a === undefined) {
    throw "`add` requires two arguments";
  }
  if (b === undefined) {
    throw "`add` requires two arguments";
  }

  if (a._type === "ScalarDouble" && b._type === "ScalarDouble") {
    stack.push(pokaMakeScalarDouble(a.value + b.value));
  } else if (a._type === "MatrixDouble" && b._type === "ScalarDouble") {
    stack.push(pokaMakeMatrixDouble(a.value.addScalar(b.value)));
  } else if (a._type === "MatrixDouble" && b._type === "MatrixDouble") {
    stack.push(pokaMakeMatrixDouble(a.value.addMatrix(b.value)));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a, b], "add"));
  }
}

function wordCat(stack: PokaValue[]): void {
  const a = stack.pop();
  const b = stack.pop();
  if (a === undefined || a._type !== "ScalarString") {
    throw "RuntimeError";
  }
  if (b === undefined || b._type !== "ScalarString") {
    throw "RuntimeError";
  }
  stack.push(pokaScalarStringMake(b.value + a.value));
}

function wordEquals(stack: PokaValue[]): void {
  const a = stack.pop();
  const b = stack.pop();
  if (a === undefined) {
    throw "equals requires two arguments";
  }

  if (b === undefined) {
    throw "equals requires two arguments";
  }

  if (a._type !== b._type) {
    stack.push(pokaMakeScalarBoolean(false));
  }

  const coercedA = a._type === "List" ? pokaToMatrix(a) : a;
  const coercedB = b._type === "List" ? pokaToMatrix(b) : b;

  if (coercedA._type === "ScalarDouble" && coercedB._type === "ScalarDouble") {
    stack.push(pokaMakeScalarBoolean(coercedA.value === coercedB.value));
  } else if (coercedA._type === "MatrixDouble" && coercedB._type === "MatrixDouble") {
    stack.push(pokaMakeScalarBoolean(coercedA.value.equals(coercedB.value)));
  } else if (coercedA._type === "ScalarString" && coercedB._type === "ScalarString") {
    stack.push(pokaMakeScalarBoolean(coercedA.value === coercedB.value));
  } else if (coercedA._type === "MatrixString" && coercedB._type === "MatrixString") {
    stack.push(pokaMakeScalarBoolean(coercedA.value.equals(coercedB.value)));
  } else {
    throw "NotImplemented";
  }
}

function wordCol(stack: PokaValue[]): void {
  const a = stack.pop();
  const b = stack.pop();
  if (a === undefined) {
    throw "col requires two arguments";
  }

  if (b === undefined) {
    throw "col requires two arguments";
  }

  if (a._type === "ScalarDouble" && b._type === "MatrixDouble") {
    stack.push(pokaMakeMatrixDouble(b.value.nthCol(a.value)));
  } else if (a._type === "ScalarDouble" && b._type === "MatrixString") {
    // stack.push(pokaMakeMatrixDouble(vectorDoubleNthColumn(b.value, a.value)));
    throw "NotImplemented";
  } else {
    stack.push(pokaMakeErrorNoImplFor([a, b], "col"));
  }
}

function wordDup(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "`dup` requires one argument";
  }
  stack.push(a);
  stack.push(a);
}

function wordSumCols(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "sumCols requires one argument";
  }

  if (a._type === "MatrixDouble") {
    stack.push(pokaMakeMatrixDouble(a.value.sumCols()));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a], "sumCols"));
  }
}

function wordSortCols(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "sortCols requires one argument";
  }

  const coercedA = a._type === "List" ? pokaToMatrix(a) : a;

  if (coercedA._type === "MatrixDouble") {
    stack.push(pokaMakeMatrixDouble(coercedA.value.sortCols()));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a], "sortCols"));
  }
}

function wordSplit(stack: PokaValue[]): void {
  const separator = stack.pop();
  const value = stack.pop();

  if (separator === undefined) {
    throw "`split` requires two arguments";
  }
  if (value === undefined) {
    throw "`split` requires two arguments";
  }

  if (separator._type === "ScalarString" && value._type === "ScalarString") {
    stack.push(
      pokaMakeMatrixString(
        new MatrixString(1, 1, [value.value]).splitScalar(separator.value),
      ),
    );
  } else if (
    separator._type === "ScalarString" &&
    value._type === "MatrixString"
  ) {
    stack.push(pokaMakeMatrixString(value.value.splitScalar(separator.value)));
  } else {
    stack.push(pokaMakeErrorNoImplFor([separator, value], "split"));
  }
}

function wordSpread(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "`spread` requires one argument";
  }
  if (a._type !== "List") {
    throw "spread requires a List";
  }
  for (const value of a.value) {
    stack.push(value);
  }
}

function wordSub(stack: PokaValue[]): void {
  const a = stack.pop();
  const b = stack.pop();

  if (a === undefined) {
    throw "`sub` requires two arguments";
  }
  if (b === undefined) {
    throw "`sub` requires two arguments";
  }

  if (a._type === "ScalarDouble" && b._type === "ScalarDouble") {
    stack.push(pokaMakeScalarDouble(a.value + b.value));
  } else if (a._type === "MatrixDouble" && b._type === "ScalarDouble") {
    stack.push(pokaMakeMatrixDouble(a.value.subScalar(b.value)));
  } else if (a._type === "MatrixDouble" && b._type === "MatrixDouble") {
    stack.push(pokaMakeMatrixDouble(a.value.subMatrix(b.value)));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a, b], "sub"));
  }
}

function wordSum(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "`sum` requires one argument";
  }

  if (a._type === "MatrixDouble") {
    stack.push(pokaMakeScalarDouble(a.value.sum()));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a], "sum"));
  }
}

function wordProd(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "`prod` requires one argument";
  }

  if (a._type === "MatrixDouble") {
    stack.push(pokaMakeScalarDouble(a.value.prod()));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a], "prod"));
  }
}

function wordToDouble(stack: PokaValue[]): void {
  const value = stack.pop();

  if (value === undefined) {
    throw "`toDouble` requires one argument";
  }

  if (value._type === "ScalarString") {
    stack.push(pokaMakeScalarDouble(parseFloat(value.value)));
  } else if (value._type === "MatrixString") {
    stack.push(pokaMakeMatrixDouble(value.value.toDouble()));
  } else {
    stack.push(pokaMakeErrorNoImplFor([value], "toDouble"));
  }
}

function wordTranspose(stack: PokaValue[]): void {
  const value = stack.pop();
  if (value === undefined) {
    throw "`transpose` requires one argument";
  }

  if (value._type === "MatrixDouble") {
    stack.push(pokaMakeMatrixDouble(value.value.transpose()));
  } else if (value._type === "MatrixString") {
    throw "NotYetImplmented";
  } else {
    stack.push(pokaMakeErrorNoImplFor([value], "transpose"));
  }
}

const POKA_WORDS: { [key: string]: (stack: PokaValue[]) => void } = {
  abs: wordAbs,
  add: wordAdd,
  equals: wordEquals,
  cat: wordCat,
  col: wordCol,
  dup: wordDup,
  sub: wordSub,
  sum: wordSum,
  sumCols: wordSumCols,
  sortCols: wordSortCols,
  split: wordSplit,
  spread: wordSpread,
  prod: wordProd,
  toDouble: wordToDouble,
  transpose: wordTranspose,
};
