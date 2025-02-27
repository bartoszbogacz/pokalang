interface MatrixBoolean {
  _type: "MatrixBoolean";
  countRows: number;
  countCols: number;
  values: boolean[];
}

function pokaMatrixBooleanMake(
  countRows: number,
  countCols: number,
  values: boolean[],
): MatrixBoolean {
  if (countRows * countCols !== values.length) {
    throw "Shape mismatch";
  }
  return {
    _type: "MatrixBoolean",
    countRows: countRows,
    countCols: countCols,
    values: values,
  };
}

function pokaMatrixBooleanAll(a: MatrixBoolean): boolean {
  return a.values.reduce((a, b) => a && b);
}

function pokaMatrixBooleanShow(a: MatrixBoolean): string {
  const result: string[] = [];
  result.push("[");
  for (let i = 0; i < a.countRows; i++) {
    result.push(" [");
    for (let j = 0; j < a.countCols; j++) {
      result.push((a.values[i * a.countCols + j] ? "X" : ".") + ", ");
    }
    result.push("], ");
  }
  result.push("]");
  return result.join("");
}

function pokaVectorBooleanCat(values: VectorBoolean[]): MatrixBoolean {
  const first = values[0];
  if (first === undefined) {
    throw new Error("Cannot concatenate an empty list of vectors.");
  }
  const firstLen = first.values.length;

  for (let i = 1; i < values.length; i++) {
    if ((values[i] as VectorBoolean).values.length !== firstLen) {
      throw new Error("Cannot concatenate vectors with different lengths.");
    }
  }

  const combinedValues: boolean[] = [];
  for (const mat of values) {
    combinedValues.push(...mat.values);
  }

  return {
    _type: "MatrixBoolean",
    countRows: values.length,
    countCols: firstLen,
    values: combinedValues,
  };
}
