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
