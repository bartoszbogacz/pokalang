function wordAbs(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "`abs` requires two arguments";
  }
  if (a._type === "ScalarDouble") {
    stack.push(pokaMakeScalarDouble(Math.abs(a.value)));
  } else if (a._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleAbs(a.value)));
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
  } else if (a._type === "VectorDouble" && b._type === "ScalarDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleAddScalar(a.value, b.value)));
  } else if (a._type === "ScalarDouble" && b._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleAddScalar(b.value, a.value)));
  } else if (a._type === "VectorDouble" && b._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleAddVector(b.value, a.value)));
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
  
  if (a._type === "ScalarDouble" && b._type === "ScalarDouble") {
    stack.push(pokaMakeScalarBoolean(a.value === b.value));
  } else if (a._type === "VectorDouble" && b._type === "VectorDouble") {
    stack.push(pokaMakeScalarBoolean(vectorDoubleEquals(a.value, b.value)));
  } else if (a._type === "ScalarString" && b._type === "ScalarString") {
    stack.push(pokaMakeScalarBoolean(a.value === b.value));
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

  if (a._type === "ScalarDouble" && b._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleNthCol(b.value, a.value)));
  } else if (a._type === "ScalarDouble" && b._type === "VectorString") {
    // stack.push(pokaMakeVectorDouble(vectorDoubleNthColumn(b.value, a.value)));
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

  if (a._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleSumCols(a.value)));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a], "sumCols"));
  }
}

function wordSortCols(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "sortCols requires one argument";
  }

  if (a._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleSortCols(a.value)));
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
      pokaMakeVectorString(
        vectorStringSplitScalar(
          vectorStringMake(1, 1, 1, [value.value]),
          separator.value,
        ),
      ),
    );
  } else if (
    separator._type === "ScalarString" &&
    value._type === "VectorString"
  ) {
    stack.push(
      pokaMakeVectorString(
        vectorStringSplitScalar(value.value, separator.value),
      ),
    );
  } else {
    stack.push(pokaMakeErrorNoImplFor([separator, value], "split"));
  }
}

function wordSpreadCols(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "`spreadCols` requires one argument";
  }
  if (a._type === "VectorDouble") {
    for (let i = 0; i < a.value.countCols; i++) {
      stack.push(pokaMakeVectorDouble(vectorDoubleNthCol(a.value, i)));
    }
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
  } else if (a._type === "VectorDouble" && b._type === "ScalarDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleSubScalar(a.value, b.value)));
  } else if (a._type === "ScalarDouble" && b._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleSubScalar(b.value, a.value)));
  } else if (a._type === "VectorDouble" && b._type === "VectorDouble") {
    stack.push(pokaMakeVectorDouble(vectorDoubleSubVector(b.value, a.value)));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a, b], "sub"));
  }
}

function wordSum(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "`sum` requires one argument";
  }

  if (a._type === "VectorDouble") {
    stack.push(pokaMakeScalarDouble(vectorDoubleSum(a.value)));
  } else {
    stack.push(pokaMakeErrorNoImplFor([a], "sum"));
  }
}

function wordProd(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "`prod` requires one argument";
  }

  if (a._type === "VectorDouble") {
    stack.push(pokaMakeScalarDouble(vectorDoubleProd(a.value)));
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
  } else if (value._type === "VectorString") {
    stack.push(pokaMakeVectorDouble(vectorStringToDouble(value.value)));
  } else {
    stack.push(pokaMakeErrorNoImplFor([value], "toDouble"));
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
  spreadCols: wordSpreadCols,
  prod: wordProd,
  toDouble: wordToDouble,
};
