const POKA_WORDS4: { [key: string]: PokaWord4 } = {};

function pokaWordAll(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const aVectorBoolean = pokaVectorBooleanFrom(a);

  if (aVectorBoolean !== null) {
    stack.push(pokaScalarBooleanMake(pokaVectorBooleanAll(aVectorBoolean)));
    return;
  }

  const aMatrixBoolean = pokaMatrixBooleanFrom(a);

  if (aMatrixBoolean !== null) {
    stack.push(pokaScalarBooleanMake(pokaMatrixBooleanAll(aMatrixBoolean)));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["all"] = {
  doc: [
    "[true, true] all true equals",
    "[false, false] all false equals",
    "[true, false] all false equals",
    "[[true, true] [true, true]] all true equals",
    "[[true, false] [false, true]] all false equals",
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

  const aVectorBoolean = pokaVectorBooleanFrom(a);
  const bVectorBoolean = pokaVectorBooleanFrom(b);
  if (aVectorBoolean !== null && bVectorBoolean !== null) {
    stack.push(
      pokaVectorBooleanEqualsVectorBoolean(aVectorBoolean, bVectorBoolean),
    );
    return;
  }

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);
  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(
      pokaVectorNumberEqualsVectorNumber(aVectorNumber, bVectorNumber),
    );
    return;
  }

  const aVectorString = pokaVectorStringFrom(a);
  const bVectorString = pokaVectorStringFrom(b);
  if (aVectorString !== null && bVectorString !== null) {
    stack.push(
      pokaVectorStringEqualsVectorString(aVectorString, bVectorString),
    );
    return;
  }

  const aMatrixBoolean = pokaMatrixBooleanFrom(a);
  const bMatrixBoolean = pokaMatrixBooleanFrom(b);
  if (aMatrixBoolean !== null && bMatrixBoolean !== null) {
    stack.push(
      pokaMatrixBooleanEqualsMatrixBoolean(aMatrixBoolean, bMatrixBoolean),
    );
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);
  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(
      pokaMatrixNumberEqualsMatrixNumber(aMatrixNumber, bMatrixNumber),
    );
    return;
  }

  const aMatrixString = pokaMatrixStringFrom(a);
  const bMatrixString = pokaMatrixStringFrom(b);
  if (aMatrixString !== null && bMatrixString !== null) {
    stack.push(
      pokaMatrixStringEqualsMatrixString(aMatrixString, bMatrixString),
    );
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
    "true true equals",
    "false false equals",
    "1 1 equals",
    '"a" "a" equals',
    "[true, false] [true, false] equals all",
    "[false, true] [true, false] equals all false equals",
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

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(pokaVectorNumberAddVectorNumber(aVectorNumber, bVectorNumber));
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(pokaMatrixNumberAddMatrixNumber(aMatrixNumber, bMatrixNumber));
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

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(pokaVectorNumberSubVectorNumber(aVectorNumber, bVectorNumber));
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(pokaMatrixNumberSubMatrixNumber(aMatrixNumber, bMatrixNumber));
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

  const aVectorNumber = pokaVectorNumberFrom(a);

  if (aVectorNumber !== null) {
    stack.push(pokaScalarNumberMake(pokaVectorNumberSum(aVectorNumber)));
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);

  if (aMatrixNumber !== null) {
    stack.push(pokaScalarNumberMake(pokaMatrixNumberSum(aMatrixNumber)));
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

  const aVectorNumber = pokaVectorNumberFrom(a);

  if (aVectorNumber !== null) {
    stack.push(pokaVectorNumberAbs(aVectorNumber));
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);

  if (aMatrixNumber !== null) {
    stack.push(pokaMatrixNumberAbs(aMatrixNumber));
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

  const aMatrixNumber = pokaMatrixNumberFrom(a);

  if (aMatrixNumber !== null) {
    stack.push(pokaMatrixNumberSortRows(aMatrixNumber));
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

  const aMatrixNumber = pokaMatrixNumberFrom(a);

  if (aMatrixNumber !== null) {
    stack.push(pokaMatrixNumberSortCols(aMatrixNumber));
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

  const aMatrixNumber = pokaMatrixNumberFrom(a);

  if (aMatrixNumber !== null) {
    stack.push(pokaMatrixNumberTranspose(aMatrixNumber));
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

  const bVectorNumber = pokaVectorNumberFrom(b);

  if (amNumber !== null && bVectorNumber !== null) {
    stack.push(pokaMatrixNumberColsVectorNumber(amNumber, bVectorNumber));
    return;
  }

  if (amString !== null && bVectorNumber !== null) {
    stack.push(pokaMatrixStringColsVectorNumber(amString, bVectorNumber));
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

  const aVectorString = pokaVectorStringFrom(a);

  if (aVectorString !== null) {
    stack.push(pokaVectorStringToNumber(aVectorString));
    return;
  }

  const aMatrixString = pokaMatrixStringFrom(a);

  if (aMatrixString !== null) {
    stack.push(pokaMatrixStringToNumber(aMatrixString));
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

  const aVectorString = pokaVectorStringFrom(a);

  if (aVectorString !== null && b._type === "ScalarString") {
    stack.push(pokaVectorStringSplitScalarString(aVectorString, b.value));
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

  const aMatrixNumber = pokaMatrixNumberFrom(a);

  if (aMatrixNumber !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberRotrScalarNumber(aMatrixNumber, b.value));
    return;
  }

  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aMatrixNumber !== null && bVectorNumber !== null) {
    stack.push(pokaMatrixNumberRotrVectorNumber(aMatrixNumber, bVectorNumber));
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

  const aVectorBoolean = pokaVectorBooleanFrom(a);
  if (aVectorBoolean !== null) {
    stack.push(pokaVectorBooleanWindows(aVectorBoolean, b.value));
    return;
  }

  const aVectorNumber = pokaVectorNumberFrom(a);
  if (aVectorNumber !== null) {
    stack.push(pokaVectorNumberWindows(aVectorNumber, b.value));
    return;
  }

  const aVectorString = pokaVectorStringFrom(a);
  if (aVectorString !== null) {
    stack.push(pokaVectorStringWindows(aVectorString, b.value));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["windows"] = {
  doc: [
    "[1, 2, 3] 2 windows [[1, 2], [2, 3]] equals all",
    "[true, false, true] 2 windows [[true, false], [false, true]] equals all",
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

  const aVectorBoolean = pokaVectorBooleanFrom(a);
  if (aVectorBoolean !== null) {
    stack.push(pokaVectorBooleanEnumerate(aVectorBoolean));
    return;
  }

  const aVectorNumber = pokaVectorNumberFrom(a);
  if (aVectorNumber !== null) {
    stack.push(pokaVectorNumberEnumerate(aVectorNumber));
    return;
  }

  const aVectorString = pokaVectorStringFrom(a);
  if (aVectorString !== null) {
    stack.push(pokaVectorStringEnumerate(aVectorString));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["enumerate"] = {
  doc: [
    "[1, 2, 3] enumerate [0, 1, 2] equals all",
    "[true, false] enumerate [0, 1] equals all",
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

  const aMatrixNumber = pokaMatrixNumberFrom(a);

  if (aMatrixNumber !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberLessScalarNumber(aMatrixNumber, b.value));
    return;
  }

  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(pokaMatrixNumberLessMatrixNumber(aMatrixNumber, bMatrixNumber));
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

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(
      pokaVectorNumberGreaterVectorNumber(aVectorNumber, bVectorNumber),
    );
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(
      pokaMatrixNumberGreaterMatrixNumber(aMatrixNumber, bMatrixNumber),
    );
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["greater"] = {
  doc: [
    "2 1 greater true equals",
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

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(
      pokaVectorNumberGreaterEqualsVectorNumber(aVectorNumber, bVectorNumber),
    );
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(
      pokaMatrixNumberGreaterEqualsMatrixNumber(aMatrixNumber, bMatrixNumber),
    );
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["greaterEquals"] = {
  doc: [
    "2 2 greaterEquals true equals",
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

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(
      pokaVectorNumberLesserVectorNumber(aVectorNumber, bVectorNumber),
    );
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(
      pokaMatrixNumberLesserMatrixNumber(aMatrixNumber, bMatrixNumber),
    );
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["lesser"] = {
  doc: [
    "1 2 lesser true equals",
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

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(
      pokaVectorNumberLesserEqualsVectorNumber(aVectorNumber, bVectorNumber),
    );
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(
      pokaMatrixNumberLesserEqualsMatrixNumber(aMatrixNumber, bMatrixNumber),
    );
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["lesserEquals"] = {
  doc: [
    "1 1 lesserEquals true equals",
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
    "[[1, 1, 1], [2, 3, 2], [3, 3, 3]] equalsRows [[true], [false], [true]] equals all",
  ],
  fun: pokaWordEqualsRows,
};

function pokaWordRows(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bVectorBoolean = pokaVectorBooleanFrom(b);

  if (aMatrixNumber !== null && bVectorBoolean !== null) {
    stack.push(
      pokaMatrixNumberRowsVectorBoolean(aMatrixNumber, bVectorBoolean),
    );
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["rows"] = {
  doc: ["[[1], [2], [3]] [true, false, true] rows [[1], [3]] equals all"],
  fun: pokaWordRows,
};

function pokaWordSlice(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const bVectorNumber = pokaVectorNumberFrom(b);
  const bVectorBoolean = pokaVectorBooleanFrom(b);

  if (a._type === "List" && b._type === "ScalarNumber") {
    stack.push(pokaListSliceScalarNumber(a, b));
    return;
  }

  if (a._type === "List" && bVectorNumber !== null) {
    stack.push(pokaListSliceVectorNumber(a, bVectorNumber));
    return;
  }

  if (a._type === "List" && bVectorBoolean !== null) {
    stack.push(pokaListSliceVectorBoolean(a, bVectorBoolean));
    return;
  }
  const aVectorBoolean = pokaVectorBooleanFrom(a);

  if (aVectorBoolean !== null && b._type === "ScalarNumber") {
    stack.push(pokaVectorBooleanSliceScalarNumber(aVectorBoolean, b));
    return;
  }

  if (aVectorBoolean !== null && bVectorNumber !== null) {
    stack.push(
      pokaVectorBooleanSliceVectorNumber(aVectorBoolean, bVectorNumber),
    );
    return;
  }

  if (aVectorBoolean !== null && bVectorBoolean !== null) {
    stack.push(
      pokaVectorBooleanSliceVectorBoolean(aVectorBoolean, bVectorBoolean),
    );
    return;
  }

  const aVectorNumber = pokaVectorNumberFrom(a);

  if (aVectorNumber !== null && b._type === "ScalarNumber") {
    stack.push(pokaVectorNumberSliceScalarNumber(aVectorNumber, b));
    return;
  }

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(pokaVectorNumberSliceVectorNumber(aVectorNumber, bVectorNumber));
    return;
  }

  if (aVectorNumber !== null && bVectorBoolean !== null) {
    stack.push(
      pokaVectorNumberSliceVectorBoolean(aVectorNumber, bVectorBoolean),
    );
    return;
  }

  const aVectorString = pokaVectorStringFrom(a);

  if (aVectorString !== null && b._type === "ScalarNumber") {
    stack.push(pokaVectorStringSliceScalarNumber(aVectorString, b));
    return;
  }

  if (aVectorString !== null && bVectorNumber !== null) {
    stack.push(pokaVectorStringSliceVectorNumber(aVectorString, bVectorNumber));
    return;
  }

  if (aVectorString !== null && bVectorBoolean !== null) {
    stack.push(
      pokaVectorStringSliceVectorBoolean(aVectorString, bVectorBoolean),
    );
    return;
  }

  const aMatrixBoolean = pokaMatrixBooleanFrom(a);
  if (bVectorBoolean !== null && aMatrixBoolean !== null) {
    stack.push(
      pokaMatrixBooleanSliceVectorBoolean(aMatrixBoolean, bVectorBoolean),
    );
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  if (bVectorBoolean !== null && aMatrixNumber !== null) {
    stack.push(
      pokaMatrixNumberSliceVectorBoolean(aMatrixNumber, bVectorBoolean),
    );
    return;
  }

  const aMatrixString = pokaMatrixStringFrom(a);
  if (bVectorBoolean !== null && aMatrixString !== null) {
    stack.push(
      pokaMatrixStringSliceVectorBoolean(aMatrixString, bVectorBoolean),
    );
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["slice"] = {
  doc: [
    "[[1, 2], [3, 4], [5, 6]] [true, false, true] slice [[1, 2], [5, 6]] equals all",
    "[[1, 2, 3], [4, 5, 6]] [false, true] slice [[4, 5, 6]] equals all",
    "[[true, false], [false, false], [true, true]] [true, false, true] slice [[true, false], [true, true]] equals all",
    '["a", "b", "c"] [0, 2] slice ["a", "c"] equals all',
    "[1, 2] 0 slice 1 equals",
    "[1, 2] [1, 0] slice [2, 1] equals all",
    "[1, 2, 3] [true, false, true] slice [1, 3] equals all",
    '[ ["a"], [2, 3], [4, 5, 6] ] 2 slice [4, 5, 6] equals all',
    "[true, false] 1 slice false equals",
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
    "[[true], [false]] squeeze [true, false] equals all",
  ],
  fun: pokaWordSqueeze,
};

function pokaWordAnd(stack: PokaValue[]): void {
  const b = stack.pop();
  const a = stack.pop();

  if (a === undefined || b === undefined) {
    throw "Stack underflow";
  }

  const aVectorBoolean = pokaVectorBooleanFrom(a);
  const bVectorBoolean = pokaVectorBooleanFrom(b);

  if (aVectorBoolean !== null && bVectorBoolean !== null) {
    stack.push(
      pokaVectorBooleanAndVectorBoolean(aVectorBoolean, bVectorBoolean),
    );
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["and"] = {
  doc: [
    "[true, false, true] [true, false, false] and [true, false, false] equals all",
  ],
  fun: pokaWordAnd,
};

function pokaWordAllRows(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const aMatrixBoolean = pokaMatrixBooleanFrom(a);

  if (aMatrixBoolean !== null) {
    stack.push(pokaMatrixBooleanAllRows(aMatrixBoolean));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["allRows"] = {
  doc: [
    "[[true, true, true], [true, false, true], [false, false, false]] allRows [[true], [false], [false]] equals all",
  ],
  fun: pokaWordAllRows,
};

function pokaWordAnyRows(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const aMatrixBoolean = pokaMatrixBooleanFrom(a);

  if (aMatrixBoolean !== null) {
    stack.push(pokaMatrixBooleanAnyRows(aMatrixBoolean));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["anyRows"] = {
  doc: [
    "[[true, true, true], [true, false, true], [false, false, false]] anyRows [[true], [true], [false]] equals all",
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

  const aVectorBoolean = pokaVectorBooleanFrom(a);
  const bVectorBoolean = pokaVectorBooleanFrom(b);
  if (aVectorBoolean !== null && bVectorBoolean !== null) {
    stack.push(
      pokaVectorBooleanUnequalsVectorBoolean(aVectorBoolean, bVectorBoolean),
    );
    return;
  }

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);
  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(
      pokaVectorNumberUnequalsVectorNumber(aVectorNumber, bVectorNumber),
    );
    return;
  }

  const aVectorString = pokaVectorStringFrom(a);
  const bVectorString = pokaVectorStringFrom(b);
  if (aVectorString !== null && bVectorString !== null) {
    stack.push(
      pokaVectorStringUnequalsVectorString(aVectorString, bVectorString),
    );
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  if (aMatrixNumber !== null && b._type === "ScalarNumber") {
    stack.push(pokaMatrixNumberUnequalsScalarNumber(aMatrixNumber, b.value));
    return;
  }

  const bMatrixBoolean = pokaMatrixBooleanFrom(b);
  const bMatrixNumber = pokaMatrixNumberFrom(b);
  const bMatrixString = pokaMatrixStringFrom(b);
  const aMatrixBoolean = pokaMatrixBooleanFrom(a);
  const aMatrixString = pokaMatrixStringFrom(a);

  if (aMatrixBoolean !== null && bMatrixBoolean !== null) {
    stack.push(
      pokaMatrixBooleanUnequalsMatrixBoolean(aMatrixBoolean, bMatrixBoolean),
    );
    return;
  }

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(
      pokaMatrixNumberUnequalsMatrixNumber(aMatrixNumber, bMatrixNumber),
    );
    return;
  }

  if (aMatrixString !== null && bMatrixString !== null) {
    stack.push(
      pokaMatrixStringUnequalsMatrixString(aMatrixString, bMatrixString),
    );
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
    "1 2 unequals true equals",
    "[[1, 2]] [[2, 2]] unequals [[true, false]] equals all",
    "[[1, 2]] 2 unequals [[true, false]] equals all",
    "[1, 2] [1, 3] unequals [false, true] equals all",
    "[true, 1] [true, 1] unequals false equals",
    "[true, 1] [true, 2] unequals true equals",
    '["a" 1 entry] ["a" 1 entry] unequals false equals',
    '["a" 1 entry] ["a" 2 entry] unequals true equals',
  ],
  fun: pokaWordUnequals,
};

function pokaWordCount(stack: PokaValue[]): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const aVectorBoolean = pokaVectorBooleanFrom(a);

  if (aVectorBoolean !== null) {
    stack.push(pokaScalarNumberMake(pokaVectorBooleanCount(aVectorBoolean)));
    return;
  }

  const aMatrixBoolean = pokaMatrixBooleanFrom(a);

  if (aMatrixBoolean !== null) {
    stack.push(pokaScalarNumberMake(pokaMatrixBooleanCount(aMatrixBoolean)));
    return;
  }

  throw "No implemenetation";
}

POKA_WORDS4["count"] = {
  doc: [
    "[[true, false], [false, false]] count 1 equals",
    "[true, false, false] count 1 equals",
  ],
  fun: pokaWordCount,
};

function pokaWordTrue(stack: PokaValue[]): void {
  stack.push(pokaScalarBooleanMake(true));
}

POKA_WORDS4["true"] = {
  doc: ["true true equals"],
  fun: pokaWordTrue,
};

function pokaWordFalse(stack: PokaValue[]): void {
  stack.push(pokaScalarBooleanMake(false));
}

POKA_WORDS4["false"] = {
  doc: ["false false equals"],
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

  let result: string;
  if (a._type === "ScalarBoolean") {
    result = a.value ? "True" : "False";
  } else if (a._type === "ScalarNumber") {
    result = a.value.toString();
  } else if (a._type === "ScalarString") {
    result = '"' + a.value + '"';
  } else if (a._type === "PokaVectorBoolean") {
    result = pokaVectorBooleanShow(a);
  } else if (a._type === "PokaVectorNumber") {
    result = pokaVectorNumberShow(a);
  } else if (a._type === "PokaVectorString") {
    result = pokaVectorStringShow(a);
  } else if (a._type === "PokaMatrixBoolean") {
    result = pokaMatrixBooleanShow(a);
  } else if (a._type === "PokaMatrixNumber") {
    result = pokaMatrixNumberShow(a);
  } else if (a._type === "PokaMatrixString") {
    result = pokaMatrixStringShow(a);
  } else if (a._type === "List") {
    const strings: string[] = [];
    for (const v of a.value) {
      const text = pokaCallWordString(pokaWordShow, [v]);
      strings.push(text);
    }
    result = "[" + strings.join(", ") + "]";
  } else if (a._type === "RecordEntry") {
    const text = pokaCallWordString(pokaWordShow, [a.value]);
    result = ":" + a.key + " " + text;
  } else if (a._type === "PokaRecord") {
    const asList = pokaListTryFrom(a);
    if (asList === null) {
      throw "Unreachable";
    }
    const text = pokaCallWordString(pokaWordShow, [asList]);
    result = text;
  } else {
    throw "Unreachable";
  }

  stack.push(pokaScalarStringMake(result));
}

POKA_WORDS4["show"] = {
  doc: [
    'true show "True" equals',
    '1 show "1" equals',
    '"a" show "a" equals false equals',
    '[true, false] [true, true] equals show "[X,.]" equals',
    '["1", "2"] toNumber show "[1.00, 2.00]" equals',
    '"a b" " " split show "[a, b]" equals false equals',
    '[true, false] 2 windows show "[\n  [True, False, ],\n]" equals',
    '[1, 2] 2 windows show "[\n  [1.00, 2.00, ],\n]" equals',
    '"a" "(a)" match show "[\n  [a, ],\n]" equals false equals',
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

  const aVectorNumber = pokaVectorNumberFrom(a);
  const bVectorNumber = pokaVectorNumberFrom(b);

  if (aVectorNumber !== null && bVectorNumber !== null) {
    stack.push(pokaVectorNumberMulVectorNumber(aVectorNumber, bVectorNumber));
    return;
  }

  const aMatrixNumber = pokaMatrixNumberFrom(a);
  const bMatrixNumber = pokaMatrixNumberFrom(b);

  if (aMatrixNumber !== null && bMatrixNumber !== null) {
    stack.push(pokaMatrixNumberMulMatrixNumber(aMatrixNumber, bMatrixNumber));
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

  const bVectorString = pokaVectorStringFrom(b);
  if (bVectorString !== null) {
    stack.push(pokaRecordGetVectorString(ar, bVectorString));
    return;
  }

  const bMatrixString = pokaMatrixStringFrom(b);
  if (bMatrixString !== null) {
    stack.push(pokaRecordGetMatrixString(ar, bMatrixString));
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

  const bVectorString = pokaVectorStringFrom(b);
  if (bVectorString === null) {
    throw "Key must be a PokaVectorString";
  }

  stack.push(pokaRecordGetTryVectorString(ar, bVectorString));
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

  const bVectorString = pokaVectorStringFrom(b);
  if (bVectorString !== null) {
    stack.push(pokaRecordContainsVectorString(ar, bVectorString));
    return;
  }

  const bMatrixString = pokaMatrixStringFrom(b);
  if (bMatrixString !== null) {
    stack.push(pokaRecordContainsMatrixString(ar, bMatrixString));
    return;
  }

  throw "Key must be a ScalarString";
}

POKA_WORDS4["contains"] = {
  doc: [
    '["a" 1 entry] "a" contains true equals',
    '["a" 1 entry] ["a", "b"] contains [true, false] equals all',
    '["a" 1 entry] [["a", "b"], ["b", "a"]] contains [[true, false], [false, true]] equals all',
  ],
  fun: pokaWordContains,
};
