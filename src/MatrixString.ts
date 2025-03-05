/* 
class _MatrixString {
  private readonly countCols: number;
  private readonly countRows: number;
  private readonly values: string[];

  public constructor(countCols: number, countRows: number, values: string[]) {
    if (countRows * countCols !== values.length) {
      throw new Error(
        "Dimension mismatch: countCols * countRows = " +
          countRows * countCols +
          " but values.length = " +
          values.length,
      );
    }
    this.countCols = countCols;
    this.countRows = countRows;
    this.values = values;
  }

  public static catRows(matrices: _MatrixString[]): _MatrixString {
    const first = matrices[0];
    if (first === undefined) {
      throw new Error("Cannot concatenate an empty list of matrices.");
    }
    const colCount = first.countCols;

    for (let i = 1; i < matrices.length; i++) {
      if ((matrices[i] as _MatrixString).countCols !== colCount) {
        throw new Error(
          "Cannot concatenate matrices with different column length.",
        );
      }
    }

    let totalRows = 0;
    for (const mat of matrices) {
      totalRows += mat.countRows;
    }

    const combinedValues: string[] = [];
    for (const mat of matrices) {
      combinedValues.push(...mat.values);
    }

    return new _MatrixString(totalRows, colCount, combinedValues);
  }

  public equals(other: _MatrixString): boolean {
    if (this.values.length !== other.values.length) {
      return false;
    }

    const equalValues: boolean[] = [];
    for (let i = 0; i < this.values.length; i++) {
      equalValues.push(this.values[i] === other.values[i])
    }

    return equalValues.reduce((a, b) => (a === b));
  }

  public show(): string {
    const rows: string[] = [];
    for (let r = 0; r < this.countRows; r++) {
      const colValues: string[] = [];
      for (let c = 0; c < this.countCols; c++) {
        const index = r * this.countCols + c;
        colValues.push('"' + this.values[index] + '"');
      }
      rows.push("[" + colValues.join(", ") + "]");
    }
    return "[" + rows.join(", ") + "]";
  }


  public toDouble(): MatrixDouble {
    return new MatrixDouble(
      this.countRows,
      this.countCols,
      this.values.map(parseFloat),
    );
  }
}
*/

interface PokaMatrixString {
  _type: "PokaMatrixString";
  values: string[];
  countRows: number;
  countCols: number;
}

function pokaMatrixStringMake(
  countRows: number,
  countCols: number,
  values: string[],
): PokaMatrixString {
  if (countRows * countCols !== values.length) {
    throw "Shape mismatch";
  }
  return {
    _type: "PokaMatrixString",
    countRows: countRows,
    countCols: countCols,
    values: values,
  };
}

function pokaVectorStringSplitScalarString(
  vecA: PokaVectorString,
  separator: string,
): PokaMatrixString {
  const splitted: string[][] = vecA.values.map((val) => val.split(separator));

  let maxLen = 0;
  for (const arr of splitted) {
    if (arr.length > maxLen) {
      maxLen = arr.length;
    }
  }

  const newValues: string[] = [];
  for (const chunk of splitted) {
    for (let i = 0; i < maxLen; i++) {
      if (i < chunk.length) {
        newValues.push(chunk[i] as string);
      } else {
        newValues.push("");
      }
    }
  }

  return {
    _type: "PokaMatrixString",
    countRows: vecA.values.length,
    countCols: maxLen,
    values: newValues,
  };
}

function pokaVectorStringCat(values: PokaVectorString[]): PokaMatrixString {
  const first = values[0];
  if (first === undefined) {
    throw new Error("Cannot concatenate an empty list of vectors.");
  }
  const firstLen = first.values.length;

  for (let i = 1; i < values.length; i++) {
    if ((values[i] as PokaVectorString).values.length !== firstLen) {
      throw new Error("Cannot concatenate vectors with different lengths.");
    }
  }

  const combinedValues: string[] = [];
  for (const mat of values) {
    combinedValues.push(...mat.values);
  }

  return {
    _type: "PokaMatrixString",
    countRows: values.length,
    countCols: firstLen,
    values: combinedValues,
  };
}

function pokaMatrixStringEqualsMatrixString(
  a: PokaMatrixString,
  b: PokaMatrixString,
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

function pokaMatrixStringToNumber(a: PokaMatrixString): PokaMatrixNumber {
  return pokaMatrixNumberMake(
    a.countRows,
    a.countCols,
    a.values.map(parseFloat),
  );
}

function pokaMatrixStringShow(a: PokaMatrixString): string {
  const result: string[] = [];
  result.push("[");
  for (let i = 0; i < a.countRows; i++) {
    result.push(" [");
    for (let j = 0; j < a.countCols; j++) {
      result.push('"' + a.values[i * a.countCols + j] + '", ');
    }
    result.push("], ");
  }
  result.push("]");
  return result.join("");
}
