/*
class MatrixDouble {
  private readonly countCols: number;
  private readonly countRows: number;
  private readonly values: number[];

  public constructor(countCols: number, countRows: number, values: number[]) {
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

  public abs(): MatrixDouble {
    const newVals: number[] = this.values.map(Math.abs);
    return new MatrixDouble(this.countRows, this.countCols, newVals);
  }

  public addScalar(b: number): MatrixDouble {
    const newVals: number[] = [];
    for (let i = 0; i < this.values.length; i++) {
      newVals.push((this.values[i] as number) + b);
    }
    return new MatrixDouble(this.countRows, this.countCols, newVals);
  }

  public addMatrix(b: MatrixDouble): MatrixDouble {
    if (this.countRows !== b.countRows || this.countCols !== b.countCols) {
      throw new Error("Shapes do not match for addMatrix.");
    }
    const newVals: number[] = [];
    for (let i = 0; i < this.values.length; i++) {
      newVals.push((this.values[i] as number) + (b.values[i] as number));
    }
    return new MatrixDouble(this.countRows, this.countCols, newVals);
  }

  public static catRows(matrices: MatrixDouble[]): MatrixDouble {
    const first = matrices[0];
    if (first === undefined) {
      throw new Error("Cannot concatenate an empty list of matrices.");
    }
    const colCount = first.countCols;

    for (let i = 1; i < matrices.length; i++) {
      if ((matrices[i] as MatrixDouble).countCols !== colCount) {
        throw new Error(
          "Cannot concatenate matrices with different column length.",
        );
      }
    }

    let totalRows = 0;
    for (const mat of matrices) {
      totalRows += mat.countRows;
    }

    const combinedValues: number[] = [];
    for (const mat of matrices) {
      combinedValues.push(...mat.values);
    }

    return new MatrixDouble(totalRows, colCount, combinedValues);
  }

  public equals(b: MatrixDouble): boolean {
    if (this.countRows !== b.countRows || this.countCols !== b.countCols) {
      throw new Error("Shapes do not match for equals.");
    }
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] !== b.values[i]) {
        return false;
      }
    }
    return true;
  }

  public nCols(): number {
    return this.countCols;
  }

  public nRows(): number {
    return this.countRows;
  }

  public nthCol(n: number): MatrixDouble {
    if (n < 0) {
      n = this.countCols + n;
    }
    if (n < 0 || n >= this.countCols) {
      throw new Error("Column index out of range: " + n);
    }
    const colValues: number[] = [];
    for (let r = 0; r < this.countRows; r++) {
      colValues.push(this.values[r * this.countCols + n] as number);
    }
    return new MatrixDouble(1, this.countRows, colValues);
  }

  public prod(): number {
    let product = 1;
    for (let i = 0; i < this.values.length; i++) {
      product = product * (this.values[i] as number);
    }
    return product;
  }

  public show(): string {
    const rows: string[] = [];
    for (let r = 0; r < this.countRows; r++) {
      const colValues: string[] = [];
      for (let c = 0; c < this.countCols; c++) {
        const index = r * this.countCols + c;
        colValues.push((this.values[index] as number).toFixed(2));
      }
      rows.push("[" + colValues.join(", ") + "]");
    }
    return "[" + rows.join(", ") + "]";
  }

  public subMatrix(b: MatrixDouble): MatrixDouble {
    if (this.countRows !== b.countRows || this.countCols !== b.countCols) {
      throw new Error("Shapes do not match for subMatrix.");
    }
    const newVals: number[] = [];
    for (let i = 0; i < this.values.length; i++) {
      newVals.push((this.values[i] as number) - (b.values[i] as number));
    }
    return new MatrixDouble(this.countRows, this.countCols, newVals);
  }

  public subScalar(b: number): MatrixDouble {
    const newVals: number[] = [];
    for (let i = 0; i < this.values.length; i++) {
      newVals.push((this.values[i] as number) - b);
    }
    return new MatrixDouble(this.countRows, this.countCols, newVals);
  }

  public sumCols(): MatrixDouble {
    const colSums: number[] = [];
    for (let i = 0; i < this.countCols; i++) {
      colSums.push(0);
    }
    for (let r = 0; r < this.countRows; r++) {
      for (let c = 0; c < this.countCols; c++) {
        (colSums[c] as number) += this.values[r * this.countCols + c] as number;
      }
    }
    return new MatrixDouble(1, this.countCols, colSums);
  }

  public sum(): number {
    return this.values.reduce(function (acc, val) {
      return acc + val;
    }, 0);
  }

  public sortCols(): MatrixDouble {
    return this.transpose().sortRows().transpose();
  }

  public sortRows(): MatrixDouble {
    const newVals: number[] = [];
    for (let r = 0; r < this.countRows; r++) {
      const start = r * this.countCols;
      const end = start + this.countCols;
      const row = this.values.slice(start, end);
      row.sort();
      newVals.push(...row);
    }
    return new MatrixDouble(this.countCols, this.countRows, newVals);
  }

  public transpose(): MatrixDouble {
    const newVals: number[] = [];
    for (let c = 0; c < this.countCols; c++) {
      for (let r = 0; r < this.countRows; r++) {
        newVals.push(this.values[r * this.countCols + c] as number);
      }
    }
    return new MatrixDouble(this.countRows, this.countCols, newVals);
  }
}
*/

interface PokaMatrixNumber {
  _type: "PokaMatrixNumber";
  values: number[];
  countRows: number;
  countCols: number;
}

function pokaMatrixNumberMake(
  countRows: number,
  countCols: number,
  values: number[],
): PokaMatrixNumber {
  if (countRows * countCols !== values.length) {
    throw "Shape mismatch";
  }
  return {
    _type: "PokaMatrixNumber",
    countRows: countRows,
    countCols: countCols,
    values: values,
  };
}

function pokaMatrixNumberColScalarNumber(
  matA: PokaMatrixNumber,
  n: number,
): PokaVectorNumber {
  if (n < 0) {
    n = matA.countCols + n;
  }
  if (n < 0 || n >= matA.countCols) {
    throw new Error("Column index out of range: " + n);
  }
  const colValues: number[] = [];
  for (let r = 0; r < matA.countRows; r++) {
    colValues.push(matA.values[r * matA.countCols + n] as number);
  }
  return pokaVectorNumberMake(colValues);
}

function pokaVectorNumberCat(values: PokaVectorNumber[]): PokaMatrixNumber {
  const first = values[0];
  if (first === undefined) {
    throw new Error("Cannot concatenate an empty list of vectors.");
  }
  const firstLen = first.values.length;

  for (let i = 1; i < values.length; i++) {
    if ((values[i] as PokaVectorNumber).values.length !== firstLen) {
      throw new Error("Cannot concatenate vectors with different lengths.");
    }
  }

  const combinedValues: number[] = [];
  for (const mat of values) {
    combinedValues.push(...mat.values);
  }

  return {
    _type: "PokaMatrixNumber",
    countRows: values.length,
    countCols: firstLen,
    values: combinedValues,
  };
}

function pokaMatrixNumberEqualsMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
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

function pokaMatrixNumberTranspose(a: PokaMatrixNumber): PokaMatrixNumber {
  const newVals: number[] = [];
  for (let j = 0; j < a.countCols; j++) {
    for (let i = 0; i < a.countRows; i++) {
      newVals.push(a.values[i * a.countCols + j] as number);
    }
  }
  return pokaMatrixNumberMake(a.countCols, a.countRows, newVals);
}

function pokaMatrixNumberSortRows(a: PokaMatrixNumber): PokaMatrixNumber {
  const newVals: number[] = [];
  for (let r = 0; r < a.countRows; r++) {
    const start = r * a.countCols;
    const end = start + a.countCols;
    const row = a.values.slice(start, end);
    row.sort();
    newVals.push(...row);
  }
  return pokaMatrixNumberMake(a.countRows, a.countCols, newVals);
}

function pokaMatrixNumberSortCols(a: PokaMatrixNumber): PokaMatrixNumber {
  a = pokaMatrixNumberTranspose(a);
  a = pokaMatrixNumberSortRows(a);
  a = pokaMatrixNumberTranspose(a);
  return a;
}

function pokaMatrixNumberSubMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixNumber {
  if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
    throw new Error("Shapes do not match for subMatrix.");
  }
  const newVals: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    newVals.push((a.values[i] as number) - (b.values[i] as number));
  }
  return pokaMatrixNumberMake(a.countRows, a.countCols, newVals);
}

function pokaMatrixNumberAbs(a: PokaMatrixNumber): PokaMatrixNumber {
  return pokaMatrixNumberMake(a.countRows, a.countCols, a.values.map(Math.abs));
}

function pokaMatrixNumberAddMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixNumber {
  if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
    throw new Error("Shapes do not match for subMatrix.");
  }
  const newVals: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    newVals.push((a.values[i] as number) + (b.values[i] as number));
  }
  return pokaMatrixNumberMake(a.countRows, a.countCols, newVals);
}

function pokaMatrixNumberSum(a: PokaMatrixNumber): number {
  return a.values.reduce((a, b) => a + b);
}

function pokaMatrixNumberShow(a: PokaMatrixNumber): string {
  const result: string[] = [];
  result.push("[\n");
  for (let i = 0; i < a.countRows; i++) {
    result.push("  [");
    for (let j = 0; j < a.countCols; j++) {
      result.push((a.values[i * a.countCols + j] as number).toFixed(2) + ", ");
    }
    result.push("],\n");
  }
  result.push("]");
  return result.join("");
}

function pokaMatrixNumberFrom(value: PokaValue): PokaMatrixNumber | null {
  if (value._type === "PokaMatrixNumber") {
    return value;
  }
  if (value._type !== "List" || value.value.length === 0) {
    return null;
  }

  const rows: PokaVectorNumber[] = [];
  for (const val of value.value) {
    const vec = pokaVectorNumberFrom(val);
    if (vec === null) {
      return null;
    }
    rows.push(vec);
  }
  return pokaVectorNumberCat(rows);
}

function pokaMatrixNumberRotrScalarNumber(
  a: PokaMatrixNumber,
  b: number,
): PokaMatrixNumber {
  const values: number[] = [];
  for (let i = 0; i < a.countRows; i++) {
    for (let j = 0; j < a.countCols; j++) {
      values.push(
        a.values[i * a.countCols + ((j + b) % a.countCols)] as number,
      );
    }
  }
  return pokaMatrixNumberMake(a.countRows, a.countCols, values);
}

function pokaMatrixNumberColsVectorNumber(
  a: PokaMatrixNumber,
  b: PokaVectorNumber,
): PokaMatrixNumber {
  const values: number[] = [];
  for (let i = 0; i < a.countRows; i++) {
    for (let j = 0; j < b.values.length; j++) {
      let index = b.values[j] as number;
      index = index < 0 ? a.countCols - index : index;
      values.push(a.values[i * a.countCols + index] as number);
    }
  }
  return pokaMatrixNumberMake(a.countRows, b.values.length, values);
}

function pokaMatrixNumberLessMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  if (a.values.length !== b.values.length) {
    throw "Mismatching shape";
  }
  for (let i = 0; i < a.values.length; i++) {
    for (let j = 0; j < b.values.length; j++) {
      values.push((a.values[i] as number) < (b.values[j] as number));
    }
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberGreaterMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  if (a.values.length !== b.values.length) {
    throw "Mismatching shape";
  }
  for (let i = 0; i < a.values.length; i++) {
    for (let j = 0; j < b.values.length; j++) {
      values.push((a.values[i] as number) > (b.values[j] as number));
    }
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberGreaterEqualsMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  if (a.values.length !== b.values.length) {
    throw "Mismatching shape";
  }
  for (let i = 0; i < a.values.length; i++) {
    for (let j = 0; j < b.values.length; j++) {
      values.push((a.values[i] as number) >= (b.values[j] as number));
    }
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberLesserMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  if (a.values.length !== b.values.length) {
    throw "Mismatching shape";
  }
  for (let i = 0; i < a.values.length; i++) {
    for (let j = 0; j < b.values.length; j++) {
      values.push((a.values[i] as number) < (b.values[j] as number));
    }
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberLesserEqualsMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  if (a.values.length !== b.values.length) {
    throw "Mismatching shape";
  }
  for (let i = 0; i < a.values.length; i++) {
    for (let j = 0; j < b.values.length; j++) {
      values.push((a.values[i] as number) <= (b.values[j] as number));
    }
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberLessScalarNumber(
  a: PokaMatrixNumber,
  b: number,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values.push((a.values[i] as number) < b);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberEqualsRows(a: PokaMatrixNumber): PokaMatrixBoolean {
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

function pokaMatrixNumberRowsVectorBoolean(
  a: PokaMatrixNumber,
  b: PokaVectorBoolean,
): PokaMatrixNumber {
  if (b.values.length != a.countRows) {
    throw new Error("Shape mismatch");
  }
  let countRows: number = 0;
  const values: number[] = [];
  for (let i = 0; i < a.countRows; i++) {
    if (b.values[i] === false) {
      continue;
    }
    countRows = countRows + 1;
    for (let j = 0; j < a.countCols; j++) {
      values.push(a.values[i * a.countCols + j] as number);
    }
  }
  return {
    _type: "PokaMatrixNumber",
    countRows: countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberSliceVectorBoolean(
  a: PokaMatrixNumber,
  b: PokaVectorBoolean,
): PokaMatrixNumber {
  if (b.values.length !== a.countRows) {
    throw new Error("Shape mismatch");
  }
  let countRows = 0;
  const values: number[] = [];
  for (let i = 0; i < a.countRows; i++) {
    if (b.values[i] === false) {
      continue;
    }
    countRows = countRows + 1;
    for (let j = 0; j < a.countCols; j++) {
      values.push(a.values[i * a.countCols + j] as number);
    }
  }
  return {
    _type: "PokaMatrixNumber",
    countRows: countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberSqueeze(a: PokaMatrixNumber): PokaVectorNumber {
  if (a.countCols === 1) {
    return {
      _type: "PokaVectorNumber",
      values: a.values,
    };
  } else if (a.countRows === 1) {
    return {
      _type: "PokaVectorNumber",
      values: a.values,
    };
  } else {
    throw new Error("Cannot squeeze");
  }
}

function pokaMatrixNumberEqualsScalarNumber(
  a: PokaMatrixNumber,
  b: number,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values.push((a.values[i] as number) === b);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberUnequalsMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
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

function pokaMatrixNumberUnequalsScalarNumber(
  a: PokaMatrixNumber,
  b: number,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values.push((a.values[i] as number) !== b);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: a.countRows,
    countCols: a.countCols,
    values: values,
  };
}

function pokaMatrixNumberMulMatrixNumber(
  a: PokaMatrixNumber,
  b: PokaMatrixNumber,
): PokaMatrixNumber {
  if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
    throw new Error("Shapes do not match for subMatrix.");
  }
  const newVals: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    newVals.push((a.values[i] as number) * (b.values[i] as number));
  }
  return pokaMatrixNumberMake(a.countRows, a.countCols, newVals);
}

function pokaMatrixNumberRotrVectorNumber(
  a: PokaMatrixNumber,
  b: PokaVectorNumber,
): PokaMatrixNumber {
  const values: number[] = [];
  for (let i = 0; i < a.countRows; i++) {
    for (let j = 0; j < a.countCols; j++) {
      const amount = b.values[i] as number;
      values.push(
        a.values[i * a.countCols + ((j + amount) % a.countCols)] as number,
      );
    }
  }
  return pokaMatrixNumberMake(a.countRows, a.countCols, values);
}
