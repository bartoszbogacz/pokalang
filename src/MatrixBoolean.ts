interface PokaMatrixBoolean {
  _type: "PokaMatrixBoolean";
  countRows: number;
  countCols: number;
  values: boolean[];
}

function pokaMatrixBooleanMake(
  countRows: number,
  countCols: number,
  values: boolean[],
): PokaMatrixBoolean {
  if (countRows * countCols !== values.length) {
    throw "Shape mismatch";
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: countRows,
    countCols: countCols,
    values: values,
  };
}

function pokaMatrixBooleanAll(a: PokaMatrixBoolean): boolean {
  return a.values.reduce((a, b) => a && b);
}

function pokaMatrixBooleanShow(a: PokaMatrixBoolean): string {
  const result: string[] = [];
  result.push("[\n");
  for (let i = 0; i < a.countRows; i++) {
    result.push("  [");
    for (let j = 0; j < a.countCols; j++) {
      result.push((a.values[i * a.countCols + j] ? "True" : "False") + ", ");
    }
    result.push("],\n");
  }
  result.push("]");
  return result.join("");
}

function pokaVectorBooleanCat(values: PokaVectorBoolean[]): PokaMatrixBoolean {
  const first = values[0];
  if (first === undefined) {
    throw new Error("Cannot concatenate an empty list of vectors.");
  }
  const firstLen = first.values.length;

  for (let i = 1; i < values.length; i++) {
    if ((values[i] as PokaVectorBoolean).values.length !== firstLen) {
      throw new Error("Cannot concatenate vectors with different lengths.");
    }
  }

  const combinedValues: boolean[] = [];
  for (const mat of values) {
    combinedValues.push(...mat.values);
  }

  return {
    _type: "PokaMatrixBoolean",
    countRows: values.length,
    countCols: firstLen,
    values: combinedValues,
  };
}

function pokaMatrixBooleanEqualsRows(a: PokaMatrixBoolean): PokaMatrixBoolean {
  if (a.countCols === 0) {
    throw new Error("No columns");
  }
  const values: boolean[] = [];
  for (let i = 0; i < a.countRows; i++) {
    let acc: boolean = true;
    for (let j = 0; j < a.countCols; j++) {
      acc = acc && a.values[i * a.countCols] === a.values[i * a.countCols + j];
    }
    values.push(acc);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: 1,
    values: values,
  };
}

function pokaMatrixBooleanEqualsMatrixBoolean(
  a: PokaMatrixBoolean,
  b: PokaMatrixBoolean,
): PokaMatrixBoolean {
  if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
    throw "Shape mismatch";
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] === b.values[i]);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: r,
  };
}

function pokaMatrixBooleanUnequalsMatrixBoolean(
  a: PokaMatrixBoolean,
  b: PokaMatrixBoolean,
): PokaMatrixBoolean {
  if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
    throw "Shape mismatch";
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] !== b.values[i]);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: r,
  };
}

function pokaMatrixBooleanAllRows(a: PokaMatrixBoolean): PokaMatrixBoolean {
  if (a.countCols === 0) {
    throw new Error("No columns");
  }
  const values: boolean[] = [];
  for (let i = 0; i < a.countRows; i++) {
    let acc: boolean = a.values[i * a.countCols] as boolean;
    for (let j = 1; j < a.countCols; j++) {
      acc = acc && (a.values[i * a.countCols + j] as boolean);
    }
    values.push(acc);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: 1,
    values: values,
  };
}

function pokaMatrixBooleanSqueeze(a: PokaMatrixBoolean): PokaVectorBoolean {
  if (a.countCols === 1) {
    return {
      _type: "PokaVectorBoolean",
      values: a.values,
    };
  } else if (a.countRows === 1) {
    return {
      _type: "PokaVectorBoolean",
      values: a.values,
    };
  } else {
    throw new Error("Cannot squeeze");
  }
}

function pokaMatrixBooleanAnyRows(a: PokaMatrixBoolean): PokaMatrixBoolean {
  if (a.countCols === 0) {
    throw new Error("No columns");
  }
  const values: boolean[] = [];
  for (let i = 0; i < a.countRows; i++) {
    let acc: boolean = a.values[i * a.countCols] as boolean;
    for (let j = 1; j < a.countCols; j++) {
      acc = acc || (a.values[i * a.countCols + j] as boolean);
    }
    values.push(acc);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: 1,
    values: values,
  };
}

function pokaMatrixBooleanCount(a: PokaMatrixBoolean): number {
  let acc = 0;
  for (let i = 0; i < a.values.length; i++) {
    acc += a.values[i] ? 1 : 0;
  }
  return acc;
}

function pokaMatrixBooleanSliceVectorBoolean(
  a: PokaMatrixBoolean,
  b: PokaVectorBoolean,
): PokaMatrixBoolean {
  if (b.values.length !== a.countRows) {
    throw new Error("Shape mismatch");
  }
  let countRows = 0;
  const values: boolean[] = [];
  for (let i = 0; i < a.countRows; i++) {
    if (b.values[i] === false) {
      continue;
    }
    countRows = countRows + 1;
    for (let j = 0; j < a.countCols; j++) {
      values.push(a.values[i * a.countCols + j] as boolean);
    }
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: countRows,
    countCols: a.countCols,
    values: values,
  };
}
