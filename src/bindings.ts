const POKA_WORDS2: DeprecatedPokaNativeFun = {
  pokaVectorNumberToVectorNumber: {
  },
  pokaMatrixBooleanToScalarBoolean: { },
  pokaMatrixStringToMatrixNumber: { },
  pokaMatrixNumberToScalarNumber: {
  },
  pokaMatrixNumberToMatrixNumber: {
  },
  pokaScalarBooleanAndScalarBooleanToScalarBoolean: {
  },
  pokaScalarNumberAndScalarNumberToScalarBoolean: {
  },
  pokaMatrixNumberAndScalarNumberToVectorNumber: {
  },
  pokaScalarStringAndScalarStringToVectorString: {
    split: pokaScalarStringSplitScalarString,
  },
  pokaVectorNumberToScalarNumber: {
  },
  pokaVectorBooleanAndVectorBooleanToVectorBoolean: {
  },
  pokaVectorNumberAndVectorNumberToVectorNumber: {
  },
  pokaVectorStringAndScalarStringToMatrixString: {
    split: pokaVectorStringSplitScalarString,
  },
  pokaMatrixNumberAndMatrixNumberToMatrixBoolean: {
  },
  pokaMatrixNumberAndMatrixNumberToMatrixNumber: {
  },
  pokaVectorStringAndVectorStringToVectorBoolean: {
  },
  pokaMatrixStringAndMatrixStringToMatrixBoolean: {
  },
};

const POKA_WORDS3: {[key: string]: PokaNativeFun2} = {};

POKA_WORDS3["all"] = {
  doc: [
    "[True, True] all True equals",
    "[False, False] all False equals",
    "[True, False] all False equals",
    "[[True, True] [True, True]] all True equals",
    "[[True, False] [False, True]] all False equals",
  ],
  vb_sb: pokaVectorBooleanAll,
  mb_sb: pokaMatrixBooleanAll,
},

POKA_WORDS3["equals"] = {
  doc: [
    "True True equals",
    "False False equals",
    "1 1 equals",
    '"a" "a" equals',
    "[True, False] [True, False] equals all",
    "[False, True] [True, False] equals all False equals",
  ],
  sb_sb_sb: (a, b) => a === b,
  sn_sn_sb: (a, b) => a === b,
  ss_ss_sb: (a, b) => a === b,
  vb_vb_vb: pokaVectorBooleanEqualsVectorBoolean,
  vn_vn_vb: pokaVectorNumberEqualsVectorNumber,
  vs_vs_vb: pokaVectorStringEqualsVectorString,
  mn_mn_mb: pokaMatrixNumberEqualsMatrixNumber,
  ms_ms_mb: pokaMatrixStringEqualsMatrixString,
};

POKA_WORDS3["add"] = {
  doc: [
    "1 1 add 2 equals",
    "[1, 1] [1, 1] add [2, 2] equals all",
    "[[1, 1], [1, 1]] [[1, 1], [1, 1]] add [[2, 2], [2, 2]] equals all",
  ],
  sn_sn_sn: (a, b) => a + b,
  vn_vn_vn: pokaVectorNumberAddVectorNumber,
  mn_mn_mn: pokaMatrixNumberAddMatrixNumber,
}

POKA_WORDS3["sub"] = {
  doc: [
    "3 1 sub 2 equals",
    "[3, 3] [1, 1] sub [2, 2] equals all",
    "[[3, 3], [3, 3]] [[1, 1], [1, 1]] sub [[2, 2], [2, 2]] equals all",
  ],
  sn_sn_sn: (a, b) => a - b,
  vn_vn_vn: pokaVectorNumberSubVectorNumber,
  mn_mn_mn: pokaMatrixNumberSubMatrixNumber,
}

POKA_WORDS3["sum"] = {
  doc: [
    "[1, 1] sum 2 equals",
    "[[1, 1], [2, 2]] sum 6 equals",
  ],
  vn_sn: pokaVectorNumberSum,
  mn_sn: pokaMatrixNumberSum,
}

POKA_WORDS3["abs"] = {
  doc: [
    "-1 abs 1 equals",
    "[-1, -1] abs [1, 1] equals all",
    "[[-1, -1], [-1, -1]] abs [[1, 1], [1, 1]] equals all",
  ],
  sn_sn: Math.abs,
  vn_vn: pokaVectorNumberAbs,
  mn_mn: pokaMatrixNumberAbs,
}

POKA_WORDS3["sortRows"] = {
  doc: [
    "[[2, 1], [4, 3]] sortRows [[1, 2], [3, 4]] equals all",
  ],
  mn_mn: pokaMatrixNumberSortRows,
}

POKA_WORDS3["sortCols"] = {
  doc: [
    "[[4, 1], [2, 3]] sortCols [[2, 1], [4, 3]] equals all",
  ],
  mn_mn: pokaMatrixNumberSortCols,
}

POKA_WORDS3["transpose"] = {
  doc: [
    "[[1, 2], [3, 4]] transpose [[1, 3], [2, 4]] equals all",
  ],
  mn_mn: pokaMatrixNumberTranspose,
}

POKA_WORDS3["col"] = {
  doc: [
    "[[1, 2], [3, 4]] 1 col [2, 4] equals all",
  ],
  mn_sn_vn: pokaMatrixNumberColScalarNumber,
}

POKA_WORDS3["toNumber"] = {
  doc: [
    '"1" toNumber 1 equals',
    '["1", "2"] toNumber [1, 2] equals all',
    '[["1", "2"], ["3", "4"]] toNumber [[1, 2], [3, 4]] equals all',
  ],
  ss_sn: parseFloat,
  vs_vn: pokaVectorStringToNumber,
  ms_mn: pokaMatrixStringToNumber,
}

POKA_WORDS3["split"] = {
  doc: [
    '"1 2" " " split ["1", "2"] equals all',
    '["1 2", "3 4"] " " split [["1", "2"], ["3", "4"]] equals all',
  ],
  ss_ss_vs: pokaScalarStringSplitScalarString,
  vs_ss_ms: pokaVectorStringSplitScalarString,
}

function pokaDispatch2(stack: PokaValue[], word: string): void {
  if (word === "True") {
    stack.push(pokaMakeScalarBoolean(true));
    return;
  }

  if (word === "False") {
    stack.push(pokaMakeScalarBoolean(false));
    return;
  }

  if (word === "spread") {
    const arg1 = stack.pop();
    if (arg1 === undefined) {
      throw "No implementation with no arguments";
    }
  
    if (arg1._type === "List") {
      for (const elem of arg1.value) {
        stack.push(elem);
      }
      return;
    } else {
      throw "spread only implemented for List";
    }
  }

  const decl = POKA_WORDS3[word];

  if (decl === undefined) {
    throw "No such function";
  }

  const arg1 = stack.pop();
  if (arg1 === undefined) {
    throw "No implementation with no arguments";
  }

  if (decl.ss_sn !== undefined && arg1._type === "ScalarString") {
    stack.push(pokaMakeScalarNumber(decl.ss_sn(arg1.value)));
    return;
  }

  if (decl.sn_sn !== undefined && arg1._type === "ScalarNumber") {
    stack.push(pokaMakeScalarNumber(decl.sn_sn(arg1.value)));
    return;
  }

  const vector1 = pokaTryToVector(arg1);

  if (decl.vb_sb !== undefined && vector1._type === "VectorBoolean") {
    stack.push(pokaMakeScalarBoolean(decl.vb_sb(vector1.value)));
    return;
  }

  if (decl.vn_sn !== undefined && vector1._type === "VectorNumber") {
    stack.push(pokaMakeScalarNumber(decl.vn_sn(vector1.value)));
    return;
  }

  if (decl.vn_vn !== undefined && vector1._type === "VectorNumber") {
    stack.push(pokaMakeVectorNumber(decl.vn_vn(vector1.value)));
    return;
  }

  if (decl.vs_vn !== undefined && vector1._type === "VectorString") {
    stack.push(pokaMakeVectorNumber(decl.vs_vn(vector1.value)));
    return;
  }

  const matrix1 = pokaTryToMatrix(arg1);

  if (decl.mb_sb !== undefined && matrix1._type === "MatrixBoolean") {
    stack.push(pokaMakeScalarBoolean(decl.mb_sb(matrix1.value)));
    return;
  }

  if (decl.mn_sn !== undefined && matrix1._type === "MatrixNumber") {
    stack.push(pokaMakeScalarNumber(decl.mn_sn(matrix1.value)));
    return;
  }

  if (decl.mn_mn !== undefined && matrix1._type === "MatrixNumber") {
    stack.push(pokaMakeMatrixNumber(decl.mn_mn(matrix1.value)));
    return;
  }

  if (decl.ms_mn !== undefined && matrix1._type === "MatrixString") {
    stack.push(pokaMakeMatrixNumber(decl.ms_mn(matrix1.value)));
    return;
  }

  const arg2 = stack.pop();
  if (arg2 === undefined) {
    throw "No implementation with one argument";
  }

  if (decl.sb_sb_sb !== undefined && arg1._type === "ScalarBoolean" && arg2._type === "ScalarBoolean") {
    stack.push(pokaMakeScalarBoolean(decl.sb_sb_sb(arg2.value, arg1.value)));
    return;
  }

  if (decl.sn_sn_sb !== undefined && arg1._type === "ScalarNumber" && arg2._type === "ScalarNumber") {
    stack.push(pokaMakeScalarBoolean(decl.sn_sn_sb(arg2.value, arg1.value)));
    return;
  }

  if (decl.sn_sn_sn !== undefined && arg1._type === "ScalarNumber" && arg2._type === "ScalarNumber") {
    stack.push(pokaMakeScalarNumber(decl.sn_sn_sn(arg2.value, arg1.value)));
    return;
  }

  if (decl.ss_ss_sb !== undefined && arg1._type === "ScalarString" && arg2._type === "ScalarString") {
    stack.push(pokaMakeScalarBoolean(decl.ss_ss_sb(arg2.value, arg1.value)));
    return;
  }

  if (decl.ss_ss_vs !== undefined && arg1._type === "ScalarString" && arg2._type === "ScalarString") {
    stack.push(pokaMakeVectorString(decl.ss_ss_vs(arg2.value, arg1.value)));
    return;
  }

  const vector2 = pokaTryToVector(arg2);

  if (decl.vb_vb_vb !== undefined && vector1._type === "VectorBoolean" && vector2._type === "VectorBoolean") {
    stack.push(pokaMakeVectorBoolean(decl.vb_vb_vb(vector2.value, vector1.value)));
    return;
  }

  if (decl.vn_vn_vn !== undefined && vector1._type === "VectorNumber" && vector2._type === "VectorNumber") {
    stack.push(pokaMakeVectorNumber(decl.vn_vn_vn(vector2.value, vector1.value)));
    return;
  }

  if (decl.vn_vn_vb !== undefined && vector1._type === "VectorNumber" && vector2._type === "VectorNumber") {
    stack.push(pokaMakeVectorBoolean(decl.vn_vn_vb(vector2.value, vector1.value)));
    return;
  }

  if (decl.vs_vs_vb !== undefined && vector1._type === "VectorString" && vector2._type === "VectorString") {
    stack.push(pokaMakeVectorBoolean(decl.vs_vs_vb(vector2.value, vector1.value)));
    return;
  }

  if (decl.vs_ss_ms !== undefined && arg1._type === "ScalarString" && vector2._type === "VectorString") {
    stack.push(pokaMakeMatrixString(decl.vs_ss_ms(vector2.value, arg1.value)));
    return;
  }

  const matrix2 = pokaTryToMatrix(arg2);

  if (decl.mn_mn_mb !== undefined && matrix1._type === "MatrixNumber" && matrix2._type === "MatrixNumber") {
    stack.push(pokaMakeMatrixBoolean(decl.mn_mn_mb(matrix2.value, matrix1.value)));
    return;
  }

  if (decl.mn_mn_mn !== undefined && matrix1._type === "MatrixNumber" && matrix2._type === "MatrixNumber") {
    stack.push(pokaMakeMatrixNumber(decl.mn_mn_mn(matrix2.value, matrix1.value)));
    return;
  }

  if (decl.mn_sn_vn !== undefined && arg1._type === "ScalarNumber" && matrix2._type === "MatrixNumber") {
    stack.push(pokaMakeVectorNumber(decl.mn_sn_vn(matrix2.value, arg1.value)));
    return;
  }

  if (decl.ms_ms_mb !== undefined && matrix1._type === "MatrixString" && matrix2._type === "MatrixString") {
    stack.push(pokaMakeMatrixBoolean(decl.ms_ms_mb(matrix2.value, matrix1.value)));
    return;
  }

  throw "No implementation";
}