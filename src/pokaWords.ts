const POKA_WORDS4: { [key: string]: PokaWord4 } = {};

function pokaWordAll(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const av = pokaVectorBooleanFrom(a);

  if (av !== null) {
    stack.push(pokaScalarBooleanMake(pokaVectorBooleanAll(av)));
    return;
  }

  const am = pokaMatrixBooleanFrom(a);

  if (am !== null) {
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

  const avB = pokaVectorBooleanFrom(a);
  const bvB = pokaVectorBooleanFrom(b);
  if (avB !== null && bvB !== null) {
    stack.push(pokaVectorBooleanEqualsVectorBoolean(avB, bvB));
    return;
  }

  const avN = pokaVectorNumberFrom(a);
  const bvN = pokaVectorNumberFrom(b);
  if (avN !== null && bvN !== null) {
    stack.push(pokaVectorNumberEqualsVectorNumber(avN, bvN));
    return;
  }

  const avS = pokaVectorStringFrom(a);
  const bvS = pokaVectorStringFrom(b);
  if (avS !== null && bvS !== null) {
    stack.push(pokaVectorStringEqualsVectorString(avS, bvS));
    return;
  }

  const amB = pokaMatrixBooleanFrom(a);
  const bmB = pokaMatrixBooleanFrom(b);
  if (amB !== null && bmB !== null) {
    stack.push(pokaMatrixBooleanEqualsMatrixBoolean(amB, bmB));
    return;
  }

  const amN = pokaMatrixNumberFrom(a);
  const bmN = pokaMatrixNumberFrom(b);
  if (amN !== null && bmN !== null) {
    stack.push(pokaMatrixNumberEqualsMatrixNumber(amN, bmN));
    return;
  }

  const amS = pokaMatrixStringFrom(a);
  const bmS = pokaMatrixStringFrom(b);
  if (amS !== null && bmS !== null) {
    stack.push(pokaMatrixStringEqualsMatrixString(amS, bmS));
    return;
  }

  const ar = pokaRecordTryFrom(a);
  const br = pokaRecordTryFrom(b);

  if (ar !== null && br !== null) {
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
    '["a" 1 entry] ["a" 1 entry] equals',
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

  const av = pokaVectorNumberFrom(a);
  const bv = pokaVectorNumberFrom(b);

  if (av !== null && bv !== null) {
    stack.push(pokaVectorNumberAddVectorNumber(av, bv));
    return;
  }

  const am = pokaMatrixNumberFrom(a);
  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
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

  const av = pokaVectorNumberFrom(a);
  const bv = pokaVectorNumberFrom(b);

  if (av !== null && bv !== null) {
    stack.push(pokaVectorNumberSubVectorNumber(av, bv));
    return;
  }

  const am = pokaMatrixNumberFrom(a);
  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
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

  const av = pokaVectorNumberFrom(a);

  if (av !== null) {
    stack.push(pokaScalarNumberMake(pokaVectorNumberSum(av)));
    return;
  }

  const am = pokaMatrixNumberFrom(a);

  if (am !== null) {
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

  const av = pokaVectorNumberFrom(a);

  if (av !== null) {
    stack.push(pokaVectorNumberAbs(av));
    return;
  }

  const am = pokaMatrixNumberFrom(a);

  if (am !== null) {
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

  const am = pokaMatrixNumberFrom(a);

  if (am !== null) {
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

  const am = pokaMatrixNumberFrom(a);

  if (am !== null) {
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

  const am = pokaMatrixNumberFrom(a);

  if (am !== null) {
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

  const amNumber = pokaMatrixNumberFrom(a);
  const amString = pokaMatrixStringFrom(a);

  if (amNumber !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberColScalarNumber(amNumber, b.value));
    return;
  }

  if (amString !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixStringColScalarNumber(amString, b.value));
    return;
  }

  const bv = pokaVectorNumberFrom(b);

  if (amNumber !== null && bv !== null) {
    stack.push(pokaMatrixNumberColsVectorNumber(amNumber, bv));
    return;
  }

  if (amString !== null && bv !== null) {
    stack.push(pokaMatrixStringColsVectorNumber(amString, bv));
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

  const av = pokaVectorStringFrom(a);

  if (av !== null) {
    stack.push(pokaVectorStringToNumber(av));
    return;
  }

  const am = pokaMatrixStringFrom(a);

  if (am !== null) {
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

  const av = pokaVectorStringFrom(a);

  if (av !== null && b._type === "ScalarString") {
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

  const am = pokaMatrixNumberFrom(a);

  if (am !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberRotrScalarNumber(am, b.value));
    return;
  }

  const bv = pokaVectorNumberFrom(b);

  if (am !== null && bv !== null) {
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

  const avB = pokaVectorBooleanFrom(a);
  const avN = pokaVectorNumberFrom(a);
  const avS = pokaVectorStringFrom(a);

  if (avB !== null) {
    stack.push(pokaVectorBooleanWindows(avB, b.value));
    return;
  }

  if (avN !== null) {
    stack.push(pokaVectorNumberWindows(avN, b.value));
    return;
  }

  if (avS !== null) {
    stack.push(pokaVectorStringWindows(avS, b.value));
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

  const avB = pokaVectorBooleanFrom(a);
  const avN = pokaVectorNumberFrom(a);
  const avS = pokaVectorStringFrom(a);

  if (avB !== null) {
    stack.push(pokaVectorBooleanEnumerate(avB));
    return;
  }

  if (avN !== null) {
    stack.push(pokaVectorNumberEnumerate(avN));
    return;
  }

  if (avS !== null) {
    stack.push(pokaVectorStringEnumerate(avS));
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

  const am = pokaMatrixNumberFrom(a);

  if (am !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberLessScalarNumber(am, b.value));
    return;
  }

  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
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

function pokaWordGreater(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberGreaterScalarNumber(a, b));
    return;
  }

  const av = pokaVectorNumberFrom(a);
  const bv = pokaVectorNumberFrom(b);

  if (av !== null && bv !== null) {
    stack.push(pokaVectorNumberGreaterVectorNumber(av, bv));
    return;
  }

  const am = pokaMatrixNumberFrom(a);
  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
    stack.push(pokaMatrixNumberGreaterMatrixNumber(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["greater"] = {
  doc: [
    "2 1 greater True equals",
    "[2, 3] [1, 2] greater all",
    "[[5, 6], [7, 8]] [[1, 2], [3, 4]] greater all",
  ],
  fun: pokaWordGreater,
};

function pokaWordGreaterEquals(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberGreaterEqualsScalarNumber(a, b));
    return;
  }

  const av = pokaVectorNumberFrom(a);
  const bv = pokaVectorNumberFrom(b);

  if (av !== null && bv !== null) {
    stack.push(pokaVectorNumberGreaterEqualsVectorNumber(av, bv));
    return;
  }

  const am = pokaMatrixNumberFrom(a);
  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
    stack.push(pokaMatrixNumberGreaterEqualsMatrixNumber(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["greaterEquals"] = {
  doc: [
    "2 2 greaterEquals True equals",
    "[2, 3] [2, 2] greaterEquals all",
    "[[1]] [[1]] greaterEquals all",
  ],
  fun: pokaWordGreaterEquals,
};

function pokaWordLesser(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberLesserScalarNumber(a, b));
    return;
  }

  const av = pokaVectorNumberFrom(a);
  const bv = pokaVectorNumberFrom(b);

  if (av !== null && bv !== null) {
    stack.push(pokaVectorNumberLesserVectorNumber(av, bv));
    return;
  }

  const am = pokaMatrixNumberFrom(a);
  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
    stack.push(pokaMatrixNumberLesserMatrixNumber(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["lesser"] = {
  doc: [
    "1 2 lesser True equals",
    "[1, 2] [2, 3] lesser all",
    "[[1]] [[5]] lesser all",
  ],
  fun: pokaWordLesser,
};

function pokaWordLesserEquals(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  if (a._type === "ScalarNumber" && b._type === "ScalarNumber") {
    stack.push(pokaScalarNumberLesserEqualsScalarNumber(a, b));
    return;
  }

  const av = pokaVectorNumberFrom(a);
  const bv = pokaVectorNumberFrom(b);

  if (av !== null && bv !== null) {
    stack.push(pokaVectorNumberLesserEqualsVectorNumber(av, bv));
    return;
  }

  const am = pokaMatrixNumberFrom(a);
  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
    stack.push(pokaMatrixNumberLesserEqualsMatrixNumber(am, bm));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["lesserEquals"] = {
  doc: [
    "1 1 lesserEquals True equals",
    "[1, 2] [1, 2] lesserEquals all",
    "[[1]] [[1]] lesserEquals all",
  ],
  fun: pokaWordLesserEquals,
};

function pokaWordEqualsRows(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const amB = pokaMatrixBooleanFrom(a);
  if (amB !== null) {
    stack.push(pokaMatrixBooleanEqualsRows(amB));
    return;
  }

  const amN = pokaMatrixNumberFrom(a);
  if (amN !== null) {
    stack.push(pokaMatrixNumberEqualsRows(amN));
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

  const am = pokaMatrixNumberFrom(a);
  const bv = pokaVectorBooleanFrom(b);

  if (am !== null && bv !== null) {
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

  const avB = pokaVectorBooleanFrom(a);
  const avN = pokaVectorNumberFrom(a);
  const avS = pokaVectorStringFrom(a);
  const amB = pokaMatrixBooleanFrom(a);
  const amN = pokaMatrixNumberFrom(a);
  const amS = pokaMatrixStringFrom(a);

  const bvN = pokaVectorNumberFrom(b);
  const bvB = pokaVectorBooleanFrom(b);

  if (a._type === "List" && b._type === "ScalarNumber") {
    stack.push(pokaListSliceScalarNumber(a, b));
    return;
  }

  if (a._type === "List" && bvN !== null) {
    stack.push(pokaListSliceVectorNumber(a, bvN));
    return;
  }

  if (a._type === "List" && bvB !== null) {
    stack.push(pokaListSliceVectorBoolean(a, bvB));
    return;
  }

  if (avB !== null && b._type === "ScalarNumber") {
    stack.push(pokaVectorBooleanSliceScalarNumber(avB, b));
    return;
  }

  if (avB !== null && bvN !== null) {
    stack.push(pokaVectorBooleanSliceVectorNumber(avB, bvN));
    return;
  }

  if (avB !== null && bvB !== null) {
    stack.push(pokaVectorBooleanSliceVectorBoolean(avB, bvB));
    return;
  }

  if (avN !== null && b._type === "ScalarNumber") {
    stack.push(pokaVectorNumberSliceScalarNumber(avN, b));
    return;
  }

  if (avN !== null && bvN !== null) {
    stack.push(pokaVectorNumberSliceVectorNumber(avN, bvN));
    return;
  }

  if (avN !== null && bvB !== null) {
    stack.push(pokaVectorNumberSliceVectorBoolean(avN, bvB));
    return;
  }

  if (avS !== null && b._type === "ScalarNumber") {
    stack.push(pokaVectorStringSliceScalarNumber(avS, b));
    return;
  }

  if (avS !== null && bvN !== null) {
    stack.push(pokaVectorStringSliceVectorNumber(avS, bvN));
    return;
  }

  if (avS !== null && bvB !== null) {
    stack.push(pokaVectorStringSliceVectorBoolean(avS, bvB));
    return;
  }

  if (bvB !== null && amB !== null) {
    stack.push(pokaMatrixBooleanSliceVectorBoolean(amB, bvB));
    return;
  }

  if (bvB !== null && amN !== null) {
    stack.push(pokaMatrixNumberSliceVectorBoolean(amN, bvB));
    return;
  }

  if (bvB !== null && amS !== null) {
    stack.push(pokaMatrixStringSliceVectorBoolean(amS, bvB));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["slice"] = {
  doc: [
    "[[1, 2], [3, 4], [5, 6]] [True, False, True] slice [[1, 2], [5, 6]] equals all",
    "[[1, 2, 3], [4, 5, 6]] [False, True] slice [[4, 5, 6]] equals all",
    "[[True, False], [False, False], [True, True]] [True, False, True] slice [[True, False], [True, True]] equals all",
    '["a", "b", "c"] [0, 2] slice ["a", "c"] equals all',
    "[1, 2] 0 slice 1 equals",
    "[1, 2] [1, 0] slice [2, 1] equals all",
    "[1, 2, 3] [True, False, True] slice [1, 3] equals all",
    '[ ["a"], [2, 3], [4, 5, 6] ] 2 slice [4, 5, 6] equals all',
    "[True, False] 1 slice False equals",
  ],
  fun: pokaWordSlice,
};

function pokaWordSqueeze(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const amN = pokaMatrixNumberFrom(a);
  if (amN !== null) {
    stack.push(pokaMatrixNumberSqueeze(amN));
    return;
  }

  const amB = pokaMatrixBooleanFrom(a);
  if (amB !== null) {
    stack.push(pokaMatrixBooleanSqueeze(amB));
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

  const av = pokaVectorBooleanFrom(a);
  const bv = pokaVectorBooleanFrom(b);

  if (av !== null && bv !== null) {
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

  const am = pokaMatrixBooleanFrom(a);

  if (am !== null) {
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

  const am = pokaMatrixBooleanFrom(a);

  if (am !== null) {
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

  const avB = pokaVectorBooleanFrom(a);
  const bvB = pokaVectorBooleanFrom(b);
  if (avB !== null && bvB !== null) {
    stack.push(pokaVectorBooleanUnequalsVectorBoolean(avB, bvB));
    return;
  }

  const avN = pokaVectorNumberFrom(a);
  const bvN = pokaVectorNumberFrom(b);
  if (avN !== null && bvN !== null) {
    stack.push(pokaVectorNumberUnequalsVectorNumber(avN, bvN));
    return;
  }

  const avS = pokaVectorStringFrom(a);
  const bvS = pokaVectorStringFrom(b);
  if (avS !== null && bvS !== null) {
    stack.push(pokaVectorStringUnequalsVectorString(avS, bvS));
    return;
  }

  const amN = pokaMatrixNumberFrom(a);
  if (amN !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberUnequalsScalarNumber(amN, b.value));
    return;
  }

  const bmB = pokaMatrixBooleanFrom(b);
  const bmN = pokaMatrixNumberFrom(b);
  const bmS = pokaMatrixStringFrom(b);
  const amB = pokaMatrixBooleanFrom(a);
  const amS = pokaMatrixStringFrom(a);

  if (amB !== null && bmB !== null) {
    stack.push(pokaMatrixBooleanUnequalsMatrixBoolean(amB, bmB));
    return;
  }

  if (amN !== null && bmN !== null) {
    stack.push(pokaMatrixNumberUnequalsMatrixNumber(amN, bmN));
    return;
  }

  if (amS !== null && bmS !== null) {
    stack.push(pokaMatrixStringUnequalsMatrixString(amS, bmS));
    return;
  }

  const ar = pokaRecordTryFrom(a);
  const br = pokaRecordTryFrom(b);

  if (ar !== null && br !== null) {
    stack.push(pokaRecordUnequalsPokaRecord(ar, br));
    return;
  }

  if (a._type === "List" && b._type === "List") {
    stack.push(pokaListUnequalsPokaList(a, b));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["unequals"] = {
  doc: [
    "1 2 unequals True equals",
    "[[1, 2]] [[2, 2]] unequals [[True, False]] equals all",
    "[[1, 2]] 2 unequals [[True, False]] equals all",
    "[1, 2] [1, 3] unequals [False, True] equals all",
    "[True, 1] [True, 1] unequals False equals",
    "[True, 1] [True, 2] unequals True equals",
    '["a" 1 entry] ["a" 1 entry] unequals False equals',
    '["a" 1 entry] ["a" 2 entry] unequals True equals',
  ],
  fun: pokaWordUnequals,
};

function pokaWordCount(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const av = pokaVectorBooleanFrom(a);

  if (av !== null) {
    stack.push(pokaScalarNumberMake(pokaVectorBooleanCount(av)));
    return;
  }

  const am = pokaMatrixBooleanFrom(a);

  if (am !== null) {
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

  const asList = pokaListTryFrom(arg1);

  if (asList !== null) {
    for (const elem of pokaListSpread(asList)) {
      stack.push(elem);
    }
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["spread"] = {
  doc: [
    "[1, 1] spread equals",
    '"a b" " " split spread "b" equals',
    '[] "a" 1 entry set spread show ":a 1" equals',
  ],
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
    '"a" 1 entry show ":a 1" equals',
    '[] "a" 1 entry set show "[:a 1]" equals',
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

  const av = pokaVectorNumberFrom(a);
  const bv = pokaVectorNumberFrom(b);

  if (av !== null && bv !== null) {
    stack.push(pokaVectorNumberMulVectorNumber(av, bv));
    return;
  }

  const am = pokaMatrixNumberFrom(a);
  const bm = pokaMatrixNumberFrom(b);

  if (am !== null && bm !== null) {
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

  const keysVec = pokaVectorStringFrom(key);
  if (keysVec === null) {
    throw "Keys must be a PokaVectorString";
  }

  const valuesList = pokaListTryFrom(value);
  if (valuesList === null) {
    throw "Values must be a List";
  }

  stack.push(pokaRecordEntryMakeVectorString(keysVec, valuesList));
}

POKA_WORDS4["entry"] = {
  doc: [
    '[] "a" 1 entry set [] "a" 1 entry set equals',
    '"75,47,61,53,29" "," split dup enumerate entry ["75" 0 entry, "47" 1 entry, "61" 2 entry, "53" 3 entry, "29" 4 entry] equals',
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

  const ar = pokaRecordTryFrom(a);

  if (ar === null) {
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
  doc: ['[] "a" 1 entry set "a" get 1 equals'],
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

  const ar = pokaRecordTryFrom(a);

  if (ar === null) {
    throw "Record must PokaRecord";
  }

  if (b._type === "ScalarString") {
    stack.push(pokaRecordGetScalarString(ar, b));
    return;
  }

  const bv = pokaVectorStringFrom(b);
  if (bv !== null) {
    stack.push(pokaRecordGetVectorString(ar, bv));
    return;
  }

  const bm = pokaMatrixStringFrom(b);
  if (bm !== null) {
    stack.push(pokaRecordGetMatrixString(ar, bm));
    return;
  }

  throw "Key must be a ScalarString";
}

POKA_WORDS4["get"] = {
  doc: [
    '["a" 1 entry] "a" get 1 equals',
    '["a" 1 entry, "b" 2 entry, "c" 3 entry] ["a", "b", "c"] get [1, 2, 3] equals all',
    '["a" 1 entry, "b" 2 entry, "c" 3 entry] [["a", "b", "c"], ["c", "b", "a"]] get [[1, 2, 3], [3, 2, 1]] equals all',
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

  const ar = pokaRecordTryFrom(a);

  if (ar === null) {
    throw "Record must PokaRecord";
  }

  const bv = pokaVectorStringFrom(b);
  if (bv === null) {
    throw "Key must be a PokaVectorString";
  }

  stack.push(pokaRecordGetTryVectorString(ar, bv));
}

POKA_WORDS4["getTry"] = {
  doc: [
    '["a" 1 entry] ["b"] getTry [] equals',
    '["a" 1 entry, "b" 2 entry] ["b", "c"] getTry [2] equals all',
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

  const ar = pokaRecordTryFrom(a);

  if (ar === null) {
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
  doc: ['["a" 1 entry] "a" del [] equals'],
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

  const ar = pokaRecordTryFrom(a);
  if (ar === null) {
    throw "Record must PokaRecord";
  }

  if (b._type === "ScalarString") {
    stack.push(pokaRecordContainsScalarString(ar, b));
    return;
  }

  const bv = pokaVectorStringFrom(b);
  if (bv !== null) {
    stack.push(pokaRecordContainsVectorString(ar, bv));
    return;
  }

  const bm = pokaMatrixStringFrom(b);
  if (bm !== null) {
    stack.push(pokaRecordContainsMatrixString(ar, bm));
    return;
  }

  throw "Key must be a ScalarString";
}

POKA_WORDS4["contains"] = {
  doc: [
    '["a" 1 entry] "a" contains True equals',
    '["a" 1 entry] ["a", "b"] contains [True, False] equals all',
    '["a" 1 entry] [["a", "b"], ["b", "a"]] contains [[True, False], [False, True]] equals all',
  ],
  fun: pokaWordContains,
};
