"use strict";
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
function pokaMatrixNumberMake(countRows, countCols, values) {
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
function pokaMatrixNumberColScalarNumber(matA, n) {
    if (n < 0) {
        n = matA.countCols + n;
    }
    if (n < 0 || n >= matA.countCols) {
        throw new Error("Column index out of range: " + n);
    }
    const colValues = [];
    for (let r = 0; r < matA.countRows; r++) {
        colValues.push(matA.values[r * matA.countCols + n]);
    }
    return pokaVectorNumberMake(colValues);
}
function pokaVectorNumberCat(values) {
    const first = values[0];
    if (first === undefined) {
        throw new Error("Cannot concatenate an empty list of vectors.");
    }
    const firstLen = first.values.length;
    for (let i = 1; i < values.length; i++) {
        if (values[i].values.length !== firstLen) {
            throw new Error("Cannot concatenate vectors with different lengths.");
        }
    }
    const combinedValues = [];
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
function pokaMatrixNumberEqualsMatrixNumber(a, b) {
    if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
        throw "Shape mismatch";
    }
    const r = [];
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
function pokaMatrixNumberTranspose(a) {
    const newVals = [];
    for (let j = 0; j < a.countCols; j++) {
        for (let i = 0; i < a.countRows; i++) {
            newVals.push(a.values[i * a.countCols + j]);
        }
    }
    return pokaMatrixNumberMake(a.countCols, a.countRows, newVals);
}
function pokaMatrixNumberSortRows(a) {
    const newVals = [];
    for (let r = 0; r < a.countRows; r++) {
        const start = r * a.countCols;
        const end = start + a.countCols;
        const row = a.values.slice(start, end);
        row.sort();
        newVals.push(...row);
    }
    return pokaMatrixNumberMake(a.countRows, a.countCols, newVals);
}
function pokaMatrixNumberSortCols(a) {
    a = pokaMatrixNumberTranspose(a);
    a = pokaMatrixNumberSortRows(a);
    a = pokaMatrixNumberTranspose(a);
    return a;
}
function pokaMatrixNumberSubMatrixNumber(a, b) {
    if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
        throw new Error("Shapes do not match for subMatrix.");
    }
    const newVals = [];
    for (let i = 0; i < a.values.length; i++) {
        newVals.push(a.values[i] - b.values[i]);
    }
    return pokaMatrixNumberMake(a.countRows, a.countCols, newVals);
}
function pokaMatrixNumberAbs(a) {
    return pokaMatrixNumberMake(a.countRows, a.countCols, a.values.map(Math.abs));
}
function pokaMatrixNumberAddMatrixNumber(a, b) {
    if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
        throw new Error("Shapes do not match for subMatrix.");
    }
    const newVals = [];
    for (let i = 0; i < a.values.length; i++) {
        newVals.push(a.values[i] + b.values[i]);
    }
    return pokaMatrixNumberMake(a.countRows, a.countCols, newVals);
}
function pokaMatrixNumberSum(a) {
    return a.values.reduce((a, b) => a + b);
}
function pokaMatrixNumberShow(a) {
    const result = [];
    result.push("[");
    for (let i = 0; i < a.countRows; i++) {
        result.push(" [");
        for (let j = 0; j < a.countCols; j++) {
            result.push(a.values[i * a.countCols + j].toFixed(2) + ", ");
        }
        result.push("], ");
    }
    result.push("]");
    return result.join("");
}
function pokaMatrixNumberRotR(a, b) {
    const values = [];
    for (let i = 0; i < a.countRows; i++) {
        for (let j = 0; j < a.countCols; j++) {
            values.push(a.values[i * a.countCols + ((j + b) % a.countCols)]);
        }
    }
    return {
        _type: "PokaMatrixNumber",
        countRows: a.countRows,
        countCols: a.countCols,
        values: values,
    };
}
function pokaMatrixNumberColsVectorNumber(a, b) {
    const values = [];
    for (let i = 0; i < a.countRows; i++) {
        for (let j = 0; j < b.values.length; j++) {
            values.push(a.values[i * a.countCols + (j < 0 ? a.countCols - j : j)]);
        }
    }
    return {
        _type: "PokaMatrixNumber",
        countRows: a.countRows,
        countCols: b.values.length,
        values: values,
    };
}
function pokaMatrixNumberLessMatrixNumber(a, b) {
    const values = [];
    if (a.values.length !== b.values.length) {
        throw "Mismatching shape";
    }
    for (let i = 0; i < a.values.length; i++) {
        for (let j = 0; j < b.values.length; j++) {
            values.push(a.values[i] < b.values[j]);
        }
    }
    return {
        _type: "PokaMatrixBoolean",
        countRows: a.countRows,
        countCols: a.countCols,
        values: values,
    };
}
function pokaMatrixNumberLessScalarNumber(a, b) {
    const values = [];
    for (let i = 0; i < a.values.length; i++) {
        values.push(a.values[i] < b);
    }
    return {
        _type: "PokaMatrixBoolean",
        countRows: a.countRows,
        countCols: a.countCols,
        values: values,
    };
}
