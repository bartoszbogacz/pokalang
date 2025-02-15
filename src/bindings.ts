const POKA_WORDS2: PokaNativeFun = {
  pokaVectorBooleanToScalarBoolean: { all: pokaVectorBooleanAll },
  pokaMatrixBooleanToScalarBoolean: { all: pokaMatrixBooleanAll },
  pokaMatrixStringToMatrixNumber: { toNumber: pokaMatrixStringToNumber },
  pokaMatrixNumberToMatrixNumber: {
    sortRows: pokaMatrixNumberSortRows,
    transpose: pokaMatrixNumberTranspose,
    sortCols: pokaMatrixNumberSortCols,
  },
  pokaMatrixNumberAndScalarNumberToVectorNumber: {
    col: pokaMatrixNumberColScalarNumber,
  },
  pokaScalarStringAndScalarStringToVectorString: {
    split: pokaScalarStringSplitScalarString,
  },
  pokaVectorStringAndScalarStringToMatrixString: {
    split: pokaVectorStringSplitScalarString,
  },
  pokaMatrixNumberAndMatrixNumberToMatrixBoolean: {
    equals: pokaMatrixNumberEqualsMatrixNumber,
  },
  pokaVectorStringAndVectorStringToVectorBoolean: {
    equals: pokaVectorStringEqualsVectorString,
  },
  pokaMatrixStringAndMatrixStringToMatrixBoolean: {
    equals: pokaMatrixStringEqualsMatrixString,
  },
};

function pokaDispatch(stack: PokaValue[], word: string): void {
  const arg1 = stack.pop();
  if (arg1 === undefined) {
    throw "Stack underflow";
  }

  if (word === "spread") {
    if (arg1._type === "List") {
      for (const v of arg1.value) {
        stack.push(v);
      }
      return;
    }
  }

  const vector1 = pokaTryToVector(arg1);

  if (vector1._type === "VectorBoolean") {
    const fun = POKA_WORDS2.pokaVectorBooleanToScalarBoolean[word];
    if (fun != undefined) {
      const res = fun(vector1.value);
      stack.push(pokaMakeScalarBoolean(res));
      return;
    }
  }

  const matrix1 = pokaTryToMatrix(arg1);

  if (matrix1._type === "MatrixBoolean") {
    const fun = POKA_WORDS2.pokaMatrixBooleanToScalarBoolean[word];
    if (fun != undefined) {
      const res = fun(matrix1.value);
      stack.push(pokaMakeScalarBoolean(res));
      return;
    }
  }

  if (matrix1._type === "MatrixNumber") {
    const fun = POKA_WORDS2.pokaMatrixNumberToMatrixNumber[word];
    if (fun != undefined) {
      const res = fun(matrix1.value);
      stack.push(pokaMakeMatrixNumber(res));
      return;
    }
  }

  if (matrix1._type === "MatrixString") {
    const fun = POKA_WORDS2.pokaMatrixStringToMatrixNumber[word];
    if (fun != undefined) {
      const res = fun(matrix1.value);
      stack.push(pokaMakeMatrixNumber(res));
      return;
    }
  }

  const arg2 = stack.pop();
  if (arg2 === undefined) {
    throw "Stack underflow";
  }

  const vector2 = pokaTryToVector(arg2);

  if (arg2._type === "ScalarString" && arg1._type === "ScalarString") {
    const fun = POKA_WORDS2.pokaScalarStringAndScalarStringToVectorString[word];
    if (fun !== undefined) {
      const res = fun(arg2.value, arg1.value);
      stack.push(pokaMakeVectorString(res));
      return;
    }
  }
  if (vector2._type === "VectorString" && vector1._type === "ScalarString") {
    const fun = POKA_WORDS2.pokaVectorStringAndScalarStringToMatrixString[word];
    if (fun !== undefined) {
      const res = fun(vector2.value, vector1.value);
      stack.push(pokaMakeMatrixString(res));
      return;
    }
  }
  if (vector2._type === "VectorString" && vector1._type === "VectorString") {
    const fun =
      POKA_WORDS2.pokaVectorStringAndVectorStringToVectorBoolean[word];
    if (fun !== undefined) {
      const res = fun(vector2.value, vector1.value);
      stack.push(pokaMakeVectorBoolean(res));
      return;
    }
  }

  const matrix2 = pokaTryToMatrix(arg2);

  if (matrix2._type === "MatrixNumber" && arg1._type === "ScalarNumber") {
    const fun = POKA_WORDS2.pokaMatrixNumberAndScalarNumberToVectorNumber[word];
    if (fun !== undefined) {
      const res = fun(matrix2.value, arg1.value);
      stack.push(pokaMakeVectorNumber(res));
      return;
    }
  }

  if (matrix2._type === "MatrixNumber" && matrix1._type === "MatrixNumber") {
    const fun =
      POKA_WORDS2.pokaMatrixNumberAndMatrixNumberToMatrixBoolean[word];
    if (fun !== undefined) {
      const res = fun(matrix2.value, matrix1.value);
      stack.push(pokaMakeMatrixBoolean(res));
      return;
    }
  }

  if (matrix2._type === "MatrixString" && matrix1._type === "MatrixString") {
    const fun =
      POKA_WORDS2.pokaMatrixStringAndMatrixStringToMatrixBoolean[word];
    if (fun !== undefined) {
      const res = fun(matrix2.value, matrix1.value);
      stack.push(pokaMakeMatrixBoolean(res));
      return;
    }
  }

  throw "DispatchError: " + word;
}
