const POKA_WORDS4: { [key: string]: PokaWord4 } = {};

function pokaWordAll(stack: PokaValue[]): void {
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

function pokaWordEquals(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarBoolean" && b._type === "ScalarBoolean") {
    stack.push(pokaScalarBooleanEqualsScalarBoolean(a, b));
    return;
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberEqualsScalarNumber(a, b));
    return;
  }

  if (a._type === "ScalarString" && b._type === "ScalarString") {
    stack.push(pokaScalarStringEqualsScalarString(a, b));
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

  const ar = pokaTryToRecord(a);
  const br = pokaTryToRecord(b);

  if (ar._type === "PokaRecord" && br._type === "PokaRecord") {
    stack.push(pokaRecordEqualsPokaRecord(ar, br));
    return;
  }

  if (a._type === "List" && b._type === "List") {
    stack.push(pokaListEqualsPokaList(a, b));
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
    '[:"a" 1] [:"a" 1] equals',
  ],
  fun: pokaWordEquals,
};

function pokaWordAdd(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberAddScalarNumber(a, b));
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

function pokaWordSub(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberSubScalarNumber(a, b));
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

function pokaWordSum(stack: PokaValue[]): void {
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

function pokaWordAbs(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber") {
    stack.push(pokaScalarNumberAbs(a));
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

function pokaWordSortRows(stack: PokaValue[]): void {
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

function pokaWordSortCols(stack: PokaValue[]): void {
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

function pokaWordTranspose(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberTranspose(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["transpose"] = {
  doc: [
    "[[1, 2], [3, 4]] transpose [[1, 3], [2, 4]] equals all",
    "[[1, 2, 3], [4, 5, 6]] transpose [[1, 4], [2, 5], [3, 6]] equals all",
  ],
  fun: pokaWordTranspose,
};

function pokaWordCols(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber" && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberColScalarNumber(am, b.value));
    return;
  }

  if (am._type === "PokaMatrixString" && b._type === "ScalarNumber") {
    stack.push(pokaMatrixStringColScalarNumber(am, b.value));
    return;
  }

  const bv = pokaTryToVector(b);

  if (am._type === "PokaMatrixNumber" && bv._type === "PokaVectorNumber") {
    stack.push(pokaMatrixNumberColsVectorNumber(am, bv));
    return;
  }

  if (am._type === "PokaMatrixString" && bv._type === "PokaVectorNumber") {
    stack.push(pokaMatrixStringColsVectorNumber(am, bv));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["cols"] = {
  doc: [
    "[[1, 2], [3, 4]] 1 cols [2, 4] equals all",
    "[[1, 2], [3, 4]] [1] cols [[2], [4]] equals all",
    "[[1, 2, 3], [3, 4, 5]] [0, 1] cols [[1, 2], [3, 4]] equals all",
  ],
  fun: pokaWordCols,
};

function pokaWordToNumber(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarString") {
    stack.push(pokaScalarStringToNumber(a));
    return;
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorString") {
    stack.push(pokaVectorStringToNumber(av));
    return;
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixString") {
    stack.push(pokaMatrixStringToNumber(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["toNumber"] = {
  doc: [
    '"1" toNumber 1 equals',
    '["1", "2"] toNumber [1, 2] equals all',
    '[["1", "2"], ["3", "4"]] toNumber [[1, 2], [3, 4]] equals all',
  ],
  fun: pokaWordToNumber,
};

function pokaWordSplit(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarString" && b._type === "ScalarString") {
    stack.push(pokaScalarStringSplitScalarString(a.value, b.value));
    return;
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorString" && b._type === "ScalarString") {
    stack.push(pokaVectorStringSplitScalarString(av, b.value));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["split"] = {
  doc: [
    '"1 2" " " split ["1", "2"] equals all',
    '"1 2 3" " " split ["1", "2", "3"] equals all',
    '["1 2", "3 4"] " " split [["1", "2"], ["3", "4"]] equals all',
  ],
  fun: pokaWordSplit,
};

function pokaWordRotr(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber" && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberRotrScalarNumber(am, b.value));
    return;
  }

  const bv = pokaTryToVector(b);

  if (am._type === "PokaMatrixNumber" && bv._type === "PokaVectorNumber") {
    stack.push(pokaMatrixNumberRotrVectorNumber(am, bv));
    return;
  }

  throw "No Implementation";
}

POKA_WORDS4["rotr"] = {
  doc: [
    "[[1, 2, 3], [3, 4, 5]] 1 rotr [[2, 3, 1], [4, 5, 3]] equals all",
    "[[1, 2, 3], [3, 4, 5]] [1, 2] rotr [[2, 3, 1], [5, 3, 4]] equals all",
  ],
  fun: pokaWordRotr,
};

function pokaWordWindows(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (b._type !== "ScalarNumber") {
    throw "Window size must be a ScalarNumber";
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorBoolean") {
    stack.push(pokaVectorBooleanWindows(av, b.value));
    return;
  }

  if (av._type === "PokaVectorNumber") {
    stack.push(pokaVectorNumberWindows(av, b.value));
    return;
  }

  if (av._type === "PokaVectorString") {
    stack.push(pokaVectorStringWindows(av, b.value));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["windows"] = {
  doc: [
    "[1, 2, 3] 2 windows [[1, 2], [2, 3]] equals all",
    "[True, False, True] 2 windows [[True, False], [False, True]] equals all",
    '["a", "b", "c"] 2 windows [["a", "b"], ["b", "c"]] equals all',
  ],
  fun: pokaWordWindows,
};

function pokaWordEnumerate(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "List") {
    stack.push(pokaListEnumerate(a));
    return;
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorBoolean") {
    stack.push(pokaVectorBooleanEnumerate(av));
    return;
  }

  if (av._type === "PokaVectorNumber") {
    stack.push(pokaVectorNumberEnumerate(av));
    return;
  }

  if (av._type === "PokaVectorString") {
    stack.push(pokaVectorStringEnumerate(av));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["enumerate"] = {
  doc: [
    "[1, 2, 3] enumerate [0, 1, 2] equals all",
    "[True, False] enumerate [0, 1] equals all",
    "[] enumerate dup equals count 0 equals",
    '["a", "b", "c"] enumerate [0, 1, 2] equals all',
  ],
  fun: pokaWordEnumerate,
};

function pokaWordLess(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber" && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberLessScalarNumber(am, b.value));
    return;
  }

  const bm = pokaTryToMatrix(b);

  if (am._type === "PokaMatrixNumber" && bm._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberLessMatrixNumber(am, bm));
    return;
  }

  throw "No Implementation";
}

POKA_WORDS4["less"] = {
  doc: [
    "[[1, 2], [3, 4]] [[5, 6], [7, 8]] less all",
    "[[1, 2], [3, 4]] 5 less all",
  ],
  fun: pokaWordLess,
};

function pokaWordEqualsRows(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaMatrixBooleanEqualsRows(am));
    return;
  }

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberEqualsRows(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["equalsRows"] = {
  doc: [
    "[[1, 1, 1], [2, 3, 2], [3, 3, 3]] equalsRows [[True], [False], [True]] equals all",
  ],
  fun: pokaWordEqualsRows,
};

function pokaWordRows(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);
  const bv = pokaTryToVector(b);

  if (am._type === "PokaMatrixNumber" && bv._type === "PokaVectorBoolean") {
    stack.push(pokaMatrixNumberRowsVectorBoolean(am, bv));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["rows"] = {
  doc: ["[[1], [2], [3]] [True, False, True] rows [[1], [3]] equals all"],
  fun: pokaWordRows,
};

function pokaWordSlice(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);
  const bv = pokaTryToVector(b);

  if (bv._type !== "PokaVectorBoolean") {
    throw "Slice mask must be PokaVectorBoolean";
  }

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaMatrixBooleanSliceVectorBoolean(am, bv));
    return;
  }

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberSliceVectorBoolean(am, bv));
    return;
  }

  if (am._type === "PokaMatrixString") {
    stack.push(pokaMatrixStringSliceVectorBoolean(am, bv));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["slice"] = {
  doc: [
    "[[1, 2], [3, 4], [5, 6]] [True, False, True] slice [[1, 2], [5, 6]] equals all",
    "[[1, 2, 3], [4, 5, 6]] [False, True] slice [[4, 5, 6]] equals all",
    "[[True, False], [False, False], [True, True]] [True, False, True] slice [[True, False], [True, True]] equals all",
    '[["a", "b"], ["c", "d"], ["e", "f"]] [False, True, True] slice [["c", "d"], ["e", "f"]] equals all',
  ],
  fun: pokaWordSlice,
};

function pokaWordSqueeze(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberSqueeze(am));
    return;
  }

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaMatrixBooleanSqueeze(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["squeeze"] = {
  doc: [
    "[[1], [2], [3]] squeeze [1, 2, 3] equals all",
    "[[True], [False]] squeeze [True, False] equals all",
  ],
  fun: pokaWordSqueeze,
};

function pokaWordAnd(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const av = pokaTryToVector(a);
  const bv = pokaTryToVector(b);

  if (av._type === "PokaVectorBoolean" && bv._type === "PokaVectorBoolean") {
    stack.push(pokaVectorBooleanAndVectorBoolean(av, bv));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["and"] = {
  doc: [
    "[True, False, True] [True, False, False] and [True, False, False] equals all",
  ],
  fun: pokaWordAnd,
};

function pokaWordAllRows(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaMatrixBooleanAllRows(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["allRows"] = {
  doc: [
    "[[True, True, True], [True, False, True], [False, False, False]] allRows [[True], [False], [False]] equals all",
  ],
  fun: pokaWordAllRows,
};

function pokaWordAnyRows(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaMatrixBooleanAnyRows(am));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["anyRows"] = {
  doc: [
    "[[True, True, True], [True, False, True], [False, False, False]] anyRows [[True], [True], [False]] equals all",
  ],
  fun: pokaWordAnyRows,
};

function pokaWordUnequals(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarBoolean" && b._type === "ScalarBoolean") {
    stack.push(pokaScalarBooleanUnequalsScalarBoolean(a, b));
    return;
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberUnequalsScalarNumber(a, b));
    return;
  }

  if (a._type === "ScalarString" && b._type === "ScalarString") {
    stack.push(pokaScalarStringUnequalsScalarString(a, b));
    return;
  }

  /*
    const av = pokaTryToVector(a);
    const bv = pokaTryToVector(b);
  
    if (av._type === "PokaVectorBoolean" && bv._type === "PokaVectorBoolean") {
      stack.push(pokaVectorBooleanUnequalsVectorBoolean(av, bv));
      return;
    }
  
    if (av._type === "PokaVectorNumber" && bv._type === "PokaVectorNumber") {
      stack.push(pokaVectorNumberUnequalsVectorNumber(av, bv));
      return;
    }
  
    if (av._type === "PokaVectorString" && bv._type === "PokaVectorString") {
      stack.push(pokaVectorStringUnequalsVectorString(av, bv));
      return;
    }
    */

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixNumber" && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberUnequalsScalarNumber(am, b.value));
    return;
  }

  const bm = pokaTryToMatrix(b);

  /*
    if (am._type === "PokaMatrixBoolean" && bm._type === "PokaMatrixBoolean") {
      stack.push(pokaMatrixBooleanUnequalsMatrixBoolean(am, bm));
      return;
    }
    */

  if (am._type === "PokaMatrixNumber" && bm._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberUnequalsMatrixNumber(am, bm));
    return;
  }

  /*
    if (am._type === "PokaMatrixString" && bm._type === "PokaMatrixString") {
      stack.push(pokaMatrixStringUnequalsMatrixString(am, bm));
      return;
    }
    */

  throw "No implementation";
}

POKA_WORDS4["unequals"] = {
  doc: [
    "[[1, 2]] [[2, 2]] unequals [[True, False]] equals all",
    "[[1, 2]] 2 unequals [[True, False]] equals all",
  ],
  fun: pokaWordUnequals,
};

function pokaWordCount(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorBoolean") {
    stack.push(pokaScalarNumberMake(pokaVectorBooleanCount(av)));
    return;
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaScalarNumberMake(pokaMatrixBooleanCount(am)));
    return;
  }

  throw "No implemenetation";
}

POKA_WORDS4["count"] = {
  doc: [
    "[[True, False], [False, False]] count 1 equals",
    "[True, False, False] count 1 equals",
  ],
  fun: pokaWordCount,
};

function pokaWordTrue(stack: PokaValue[]): void {
  stack.push(pokaScalarBooleanMake(true));
}

POKA_WORDS4["True"] = {
  doc: ["True True equals"],
  fun: pokaWordTrue,
};

function pokaWordFalse(stack: PokaValue[]): void {
  stack.push(pokaScalarBooleanMake(false));
}

POKA_WORDS4["False"] = {
  doc: ["False False equals"],
  fun: pokaWordFalse,
};

function pokaWordSpread(stack: PokaValue[]): void {
  const arg1 = stack.pop();
  if (arg1 === undefined) {
    throw "Stack underflow";
  }

  if (arg1._type === "List") {
    for (const elem of pokaListSpread(arg1)) {
      stack.push(elem);
    }
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["spread"] = {
  doc: ["[1, 1] spread equals"],
  fun: pokaWordSpread,
};

function pokaWordDup(stack: PokaValue[]): void {
  const arg1 = stack.pop();
  if (arg1 === undefined) {
    throw "Stack underflow";
  }

  stack.push(arg1);
  stack.push(arg1);
}

POKA_WORDS4["dup"] = {
  doc: ["1 dup equals"],
  fun: pokaWordDup,
};

function pokaWordId(stack: PokaValue[]): void {
  const arg1 = stack.pop();
  if (arg1 === undefined) {
    throw "Stack underflow";
  }

  stack.push(arg1);
}

POKA_WORDS4["id"] = {
  doc: ["1 1 id id equals"],
  fun: pokaWordId,
};

function pokaWordShow(stack: PokaValue[]): void {
  const a = stack.pop();
  if (a === undefined) {
    throw "Stack underflow";
  }

  stack.push(pokaScalarStringMake(pokaShow(a)));
}

POKA_WORDS4["show"] = {
  doc: [
    'True show "True" equals',
    '1 show "1" equals',
    '"a" show "a" equals False equals',
    '[True, False] [True, True] equals show "[X,.]" equals',
    '["1", "2"] toNumber show "[1.00, 2.00]" equals',
    '"a b" " " split show "[a, b]" equals False equals',
    '[True, False] 2 windows show "[\n  [True, False, ],\n]" equals',
    '[1, 2] 2 windows show "[\n  [1.00, 2.00, ],\n]" equals',
    '"a" "(a)" match show "[\n  [a, ],\n]" equals False equals',
    '[1, 2] show "[1, 2]" equals',
    ':"a" 1 show ":a 1" equals',
    '[] :"a" 1 set show "[:a 1]" equals',
  ],
  fun: pokaWordShow,
};

function pokaWordMatch(stack: PokaValue[]): void {
  const arg2 = stack.pop();
  if (arg2 === undefined) {
    throw "Stack underflow";
  }
  const arg1 = stack.pop();
  if (arg1 === undefined) {
    throw "Stack underflow";
  }

  if (arg2._type !== "ScalarString") {
    throw "Type mismatch";
  }
  if (arg1._type !== "ScalarString") {
    throw "Type mismatch";
  }

  stack.push(pokaMatrixStringMatch(arg1.value, arg2.value));
}

POKA_WORDS4["match"] = {
  doc: ['"a" "(a)" match [["a"]] equals all'],
  fun: pokaWordMatch,
};

function pokaWordMul(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberMulScalarNumber(a, b));
    return;
  }

  const av = pokaTryToVector(a);
  const bv = pokaTryToVector(b);

  if (av._type === "PokaVectorNumber" && bv._type === "PokaVectorNumber") {
    stack.push(pokaVectorNumberMulVectorNumber(av, bv));
    return;
  }

  const am = pokaTryToMatrix(a);
  const bm = pokaTryToMatrix(b);

  if (am._type === "PokaMatrixNumber" && bm._type === "PokaMatrixNumber") {
    stack.push(pokaMatrixNumberMulMatrixNumber(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["mul"] = {
  doc: [
    "1 1 mul 1 equals",
    "[1, 1] [1, 1] mul [1, 1] equals all",
    "[[1, 1], [1, 1]] [[1, 1], [1, 1]] mul [[1, 1], [1, 1]] equals all",
  ],
  fun: pokaWordMul,
};

function pokaWordEntry(stack: PokaValue[]): void {
  const value = stack.pop();
  const key = stack.pop();

  if (key === undefined || value === undefined) {
    throw "Stack underflow";
  }

  if (key._type === "ScalarString") {
    stack.push(pokaRecordEntryMakeScalarString(key, value));
    return;
  }

  const keysVec = pokaTryToVector(key);
  if (keysVec._type !== "PokaVectorString") {
    throw "Keys must be a PokaVectorString";
  }

  const valuesList = pokaTryToList(value);
  if (valuesList._type !== "List") {
    throw "Values must be a List";
  }

  stack.push(pokaRecordEntryMakeVectorString(keysVec, valuesList));
}

POKA_WORDS4["entry"] = {
  doc: [
    '[] "a" 1 entry set [] :"a" 1 set equals',
    '"75,47,61,53,29" "," split dup enumerate entry [:"75" 0, :"47" 1, :"61" 2, :"53" 3, :"29" 4] equals',
  ],
  fun: pokaWordEntry,
};

function pokaWordSet(stack: PokaValue[]): void {
  const b = stack.pop();
  if (b === undefined) {
    throw "Stack underflow";
  }
  if (b._type !== "RecordEntry") {
    throw "Expected RecordEntry";
  }

  const a = stack.pop();
  if (a === undefined) {
    throw "Stack underflow";
  }

  const ar = pokaTryToRecord(a);

  if (ar._type !== "PokaRecord") {
    throw "Record must PokaRecord";
  }

  const value: PokaRecord = {
    _type: "PokaRecord",
    value: { ...ar.value },
  };

  value.value[b.key] = b.value;

  stack.push(value);
}

POKA_WORDS4["set"] = {
  doc: ['[] :"a" 1 set "a" get 1 equals'],
  fun: pokaWordSet,
};

function pokaWordGet(stack: PokaValue[]): void {
  const b = stack.pop();
  if (b === undefined) {
    throw "Stack underflow";
  }

  const a = stack.pop();
  if (a === undefined) {
    throw "Stack underflow";
  }

  const ar = pokaTryToRecord(a);

  if (ar._type !== "PokaRecord") {
    throw "Record must PokaRecord";
  }

  if (b._type === "ScalarString") {
    stack.push(pokaRecordGetScalarString(ar, b));
    return;
  }

  const bv = pokaTryToVector(b);
  if (bv._type === "PokaVectorString") {
    stack.push(pokaRecordGetVectorString(ar, bv));
    return;
  }

  const bm = pokaTryToMatrix(b);
  if (bm._type === "PokaMatrixString") {
    stack.push(pokaRecordGetMatrixString(ar, bm));
    return;
  }

  throw "Key must be a ScalarString";
}

POKA_WORDS4["get"] = {
  doc: [
    '[:"a" 1] "a" get 1 equals',
    '[:"a" 1, :"b" 2, :"c" 3] ["a", "b", "c"] get [1, 2, 3] equals all',
    '[:"a" 1, :"b" 2, :"c" 3] [["a", "b", "c"], ["c", "b", "a"]] get [[1, 2, 3], [3, 2, 1]] equals all',
  ],
  fun: pokaWordGet,
};

function pokaGetTry(stack: PokaValue[]): void {
  const b = stack.pop();
  if (b === undefined) {
    throw "Stack underflow";
  }

  const a = stack.pop();
  if (a === undefined) {
    throw "Stack underflow";
  }

  const ar = pokaTryToRecord(a);

  if (ar._type !== "PokaRecord") {
    throw "Record must PokaRecord";
  }

  const bv = pokaTryToVector(b);
  if (bv._type !== "PokaVectorString") {
    throw "Key must be a PokaVectorString";
  }

  stack.push(pokaRecordGetTryVectorString(ar, bv));
}

POKA_WORDS4["getTry"] = {
  doc: [
    '[:"a" 1] ["b"] getTry [] equals',
    '[:"a" 1, :"b" 2] ["b", "c"] getTry [2] equals all',
  ],
  fun: pokaGetTry,
};

function pokaWordDel(stack: PokaValue[]): void {
  const b = stack.pop();
  if (b === undefined) {
    throw "Stack underflow";
  }
  if (b._type !== "ScalarString") {
    throw "Key must be a ScalarString";
  }

  const a = stack.pop();
  if (a === undefined) {
    throw "Stack underflow";
  }

  const ar = pokaTryToRecord(a);

  if (ar._type !== "PokaRecord") {
    throw "Record must PokaRecord";
  }

  const result: PokaRecord = {
    _type: "PokaRecord",
    value: { ...ar.value },
  };

  delete result.value[b.value];

  stack.push(result);
}

POKA_WORDS4["del"] = {
  doc: ['[:"a" 1] "a" del [] equals'],
  fun: pokaWordDel,
};

function pokaWordContains(stack: PokaValue[]): void {
  const b = stack.pop();
  if (b === undefined) {
    throw "Stack underflow";
  }

  const a = stack.pop();
  if (a === undefined) {
    throw "Stack underflow";
  }

  const ar = pokaTryToRecord(a);
  if (ar._type !== "PokaRecord") {
    throw "Record must PokaRecord";
  }

  if (b._type === "ScalarString") {
    stack.push(pokaRecordContainsScalarString(ar, b));
    return;
  }

  const bv = pokaTryToVector(b);
  if (bv._type === "PokaVectorString") {
    stack.push(pokaRecordContainsVectorString(ar, bv));
    return;
  }

  const bm = pokaTryToMatrix(b);
  if (bm._type === "PokaMatrixString") {
    stack.push(pokaRecordContainsMatrixString(ar, bm));
    return;
  }

  throw "Key must be a ScalarString";
}

POKA_WORDS4["contains"] = {
  doc: [
    '[:"a" 1] "a" contains True equals',
    '[:"a" 1] ["a", "b"] contains [True, False] equals all',
    '[:"a" 1] [["a", "b"], ["b", "a"]] contains [[True, False], [False, True]] equals all',
  ],
  fun: pokaWordContains,
};
