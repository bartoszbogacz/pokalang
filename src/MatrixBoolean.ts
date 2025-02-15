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
