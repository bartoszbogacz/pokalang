class MatrixDouble {
  private readonly countRows: number;
  private readonly countCols: number;
  private readonly values: number[];

  public constructor(countRows: number, countCols: number, values: number[]) {
    if (countRows * countCols !== values.length) {
      throw new Error(
        "Dimension mismatch: countRows * countCols = " +
          countRows * countCols +
          " but values.length = " +
          values.length,
      );
    }
    this.countRows = countRows;
    this.countCols = countCols;
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
    return new MatrixDouble(this.countRows, 1, colValues);
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
    return new MatrixDouble(this.countRows, this.countCols, newVals);
  }

  public transpose(): MatrixDouble {
    const newVals: number[] = [];
    for (let c = 0; c < this.countCols; c++) {
      for (let r = 0; r < this.countRows; r++) {
        newVals.push(this.values[r * this.countCols + c] as number);
      }
    }
    return new MatrixDouble(this.countCols, this.countRows, newVals);
  }
}
