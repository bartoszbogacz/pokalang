interface VectorDouble {
  countPages: number;
  countCols: number;
  countRows: number;
  values: number[];
}

function vectorDoubleMake(
  countPages: number,
  countCols: number,
  countRows: number,
  values: number[],
): VectorDouble {
  if (countPages * countCols * countRows !== values.length) {
    throw "Error";
  }
  return {
    countPages: countPages,
    countCols: countCols,
    countRows: countRows,
    values: values,
  };
}

function vectorDoubleShow(a: VectorDouble): string {
  return "[" + a.values.map((v) => v.toFixed(2)).join(" ") + "]";
}

function vectorDoubleNthCol(a: VectorDouble, n: number): VectorDouble {
  if (a.countPages !== 1) {
    throw "NotImplemented";
  }
  if (n < 0) {
    n = a.countRows + 1 + n;
  }
  const values: number[] = [];
  for (let i = 0; i < a.countRows; i++) {
    values.push(a.values[n * a.countRows + i] as number);
  }
  return vectorDoubleMake(a.countPages, 1, a.countRows, values);
}

function vectorDoubleAbs(a: VectorDouble): VectorDouble {
  return vectorDoubleMake(a.countPages, a.countCols, a.countRows, a.values.map(Math.abs));
}

function vectorDoubleAddScalar(a: VectorDouble, b: number): VectorDouble {
  const values2: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values2.push((a.values[i] as number) + b);
  }
  return vectorDoubleMake(a.countRows, a.countCols, a.countRows, values2);
}

function vectorDoubleAddVector(a: VectorDouble, b: VectorDouble): VectorDouble {
  if (
    a.countRows !== b.countRows ||
    a.countCols !== b.countCols ||
    a.countPages !== b.countPages
  ) {
    throw "Shapes do not match";
  }
  const values2: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values2.push((a.values[i] as number) + (b.values[i] as number));
  }
  return vectorDoubleMake(a.countPages, a.countCols, a.countRows, values2);
}

function vectorDoubleSubScalar(a: VectorDouble, b: number): VectorDouble {
  const values2: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values2.push((a.values[i] as number) - b);
  }
  return vectorDoubleMake(a.countRows, a.countCols, a.countRows, values2);
}

function vectorDoubleSubVector(a: VectorDouble, b: VectorDouble): VectorDouble {
  if (
    a.countRows !== b.countRows ||
    a.countCols !== b.countCols ||
    a.countPages !== b.countPages
  ) {
    throw "Shapes do not match";
  }
  const values2: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values2.push((a.values[i] as number) - (b.values[i] as number));
  }
  return vectorDoubleMake(a.countPages, a.countCols, a.countRows, values2);
}

function vectorDoubleSumCols(a: VectorDouble): VectorDouble {
  const values2: number[] = [];

  for (let i = 0; i < a.countPages; i++) {
    for (let j = 0; j < a.countCols; j++) {
      let colSum: number = 0;
      for (let k = 0; k < a.countRows; k++) {
        let index = i * a.countCols * a.countRows + j * a.countRows + k;
        colSum += a.values[index] as number;
      }
      values2.push(colSum);
    }
  }

  return vectorDoubleMake(a.countPages, a.countCols, 1, values2);
}

function vectorDoubleEquals(a: VectorDouble, b: VectorDouble): boolean {
  if (
    a.countRows !== b.countRows ||
    a.countCols !== b.countCols ||
    a.countPages !== b.countPages
  ) {
    throw "Shapes do not match";
  }

  for (let i = 0; i < a.values.length; i++) {
    if (a.values[i] !== b.values[i]) {
      return false;
    }
  }

  return true;
}

function vectorDoubleCatCols(values: VectorDouble[]): VectorDouble {
  const first = values[0];
  if (first === undefined) {
    throw "Error";
  }

  const countPages = first.countPages;
  for (const value of values) {
    if (value.countPages !== countPages) {
      throw "Inhomogenous vectors";
    }
  }

  const countRows = first.countRows;
  for (const value of values) {
    if (value.countRows !== countRows) {
      throw "Inhomogenous vectors";
    }
  }

  const values2: number[] = [];
  for (const value of values) {
    for (const elem of value.values) {
      values2.push(elem);
    }
  }
  return vectorDoubleMake(countPages, values.length, countRows, values2);
}

function vectorDoubleSum(a: VectorDouble): number {
  return a.values.reduce((a, b) => a + b);
}

function vectorDoubleSortCols(a: VectorDouble): VectorDouble {
  const values2: number[] = [];

  for (let i = 0; i < a.countPages; i++) {
    for (let j = 0; j < a.countCols; j++) {
      const column2: number[] = a.values.slice(
        i * a.countPages * a.countCols + j * a.countRows,
        i * a.countPages * a.countCols + j * a.countRows + a.countRows,
      );
      column2.sort();
      values2.push(...column2);
    }
  }

  return vectorDoubleMake(a.countPages, a.countCols, a.countRows, values2);
}

function vectorDoubleProd(a: VectorDouble): number {
  return a.values.reduce((a, b) => a * b);
}
