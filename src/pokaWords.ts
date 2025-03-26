const POKA_WORDS4: { [key: string]: PokaWordDecl3 } = {};

function pokaWordAll(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorBoolean") {
    stack.push(pokaScalarBooleanMake(pokaVectorBooleanAll(av)));
    return;
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaScalarBooleanMake(pokaMatrixBooleanAll(am)));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["all"] = {
  doc: [
    "[True, True] all True equals",
    "[False, False] all False equals",
    "[True, False] all False equals",
    "[[True, True] [True, True]] all True equals",
    "[[True, False] [False, True]] all False equals",
  ],
  fun: pokaWordAll,
};

function pokaWordEquals(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarBoolean" && b._type === "ScalarBoolean") {
    stack.push(pokaScalarBooleanMake(a.value === b.value));
    return;
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarBooleanMake(a.value === b.value));
    return;
  }

  if (a._type === "ScalarString" && b._type === "ScalarString") {
    stack.push(pokaScalarBooleanMake(a.value === b.value));
    return;
  }

  const av = pokaTryToVector(a);
  const bv = pokaTryToVector(b);

  if (av._type === "PokaVectorBoolean" && bv._type === "PokaVectorBoolean") {
    stack.push(pokaVectorBooleanEqualsVectorBoolean(av, bv));
    return;
  }

  if (av._type === "PokaVectorNumber" && bv._type === "PokaVectorNumber") {
    stack.push(pokaVectorNumberEqualsVectorNumber(av, bv));
    return;
  }

  if (av._type === "PokaVectorString" && bv._type === "PokaVectorString") {
    stack.push(pokaVectorStringEqualsVectorString(av, bv));
    return;
  }

  const am = pokaTryToMatrix(a);
  const bm = pokaTryToMatrix(b);

  if (am._type === "PokaMatrixBoolean" && bm._type === "PokaMatrixBoolean") {
    stack.push(pokaMatrixBooleanEqualsMatrixBoolean(am, bm));
    return;
  }

  if (am._type === "PokaMatrixNumber" && bm._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberEqualsMatrixNumber(am, bm));
    return;
  }

  if (am._type === "PokaMatrixString" && bm._type === "PokaMatrixString") {
    stack.push(pokaMatrixStringEqualsMatrixString(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["equals"] = {
  doc: [
    "True True equals",
    "False False equals",
    "1 1 equals",
    '"a" "a" equals',
    "[True, False] [True, False] equals all",
    "[False, True] [True, False] equals all False equals",
  ],
  fun: pokaWordEquals,
};

function pokaWordAdd(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberMake(a.value + b.value));
    return;
  }

  const av = pokaTryToVector(a);
  const bv = pokaTryToVector(b);

  if (av._type === "PokaVectorNumber" && bv._type === "PokaVectorNumber") {
    stack.push(pokaVectorNumberAddVectorNumber(av, bv));
    return;
  }

  const am = pokaTryToMatrix(a);
  const bm = pokaTryToMatrix(b);

  if (am._type === "PokaMatrixNumber" && bm._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberAddMatrixNumber(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["add"] = {
  doc: [
    "1 1 add 2 equals",
    "[1, 1] [1, 1] add [2, 2] equals all",
    "[[1, 1], [1, 1]] [[1, 1], [1, 1]] add [[2, 2], [2, 2]] equals all",
  ],
  fun: pokaWordAdd,
};

function pokaWordSub(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberMake(a.value - b.value));
    return;
  }

  const av = pokaTryToVector(a);
  const bv = pokaTryToVector(b);

  if (av._type === "PokaVectorNumber" && bv._type === "PokaVectorNumber") {
    stack.push(pokaVectorNumberSubVectorNumber(av, bv));
    return;
  }

  const am = pokaTryToMatrix(a);
  const bm = pokaTryToMatrix(b);

  if (am._type === "PokaMatrixNumber" && bm._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberSubMatrixNumber(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["sub"] = {
  doc: [
    "3 1 sub 2 equals",
    "[3, 3] [1, 1] sub [2, 2] equals all",
    "[[3, 3], [3, 3]] [[1, 1], [1, 1]] sub [[2, 2], [2, 2]] equals all",
  ],
  fun: pokaWordSub,
};

function pokaWordSum(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorNumber") {
    stack.push(pokaScalarNumberMake(pokaVectorNumberSum(av)));
    return;
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaScalarNumberMake(pokaMatrixNumberSum(am)));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["sum"] = {
  doc: ["[1, 1] sum 2 equals", "[[1, 1], [2, 2]] sum 6 equals"],
  fun: pokaWordSum,
};

function pokaWordAbs(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber") {
    stack.push(pokaScalarNumberMake(Math.abs(a.value)));
    return;
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorNumber") {
    stack.push(pokaVectorNumberAbs(av));
    return;
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberAbs(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["abs"] = {
  doc: [
    "-1 abs 1 equals",
    "[-1, -1] abs [1, 1] equals all",
    "[[-1, -1], [-1, -1]] abs [[1, 1], [1, 1]] equals all",
  ],
  fun: pokaWordAbs,
};

function pokaWordSortRows(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberSortRows(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["sortRows"] = {
  doc: ["[[2, 1], [4, 3]] sortRows [[1, 2], [3, 4]] equals all"],
  fun: pokaWordSortRows,
};

function pokaWordSortCols(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberSortCols(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["sortCols"] = {
  doc: [
    "[[4, 1], [2, 3]] sortCols [[2, 1], [4, 3]] equals all",
    "[[1, 2], [2, 1]] sortCols [[1, 1], [2, 2]] equals all",
  ],
  fun: pokaWordSortCols,
};
