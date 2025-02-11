class MatrixString {
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

  public static catRows(matrices: MatrixString[]): MatrixString {
    const first = matrices[0];
    if (first === undefined) {
      throw new Error("Cannot concatenate an empty list of matrices.");
    }
    const colCount = first.countCols;

    for (let i = 1; i < matrices.length; i++) {
      if ((matrices[i] as MatrixString).countCols !== colCount) {
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

    return new MatrixString(totalRows, colCount, combinedValues);
  }

  public equals(other: MatrixString): boolean {
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

  public splitScalar(separator: string): MatrixString {
    if (this.countRows === 1 && this.countCols === 1) {
      const value = this.values[0] as string;
      const newValues: string[] = [];
      for (const newVal of value.split(separator)) {
        newValues.push(newVal);
      }
      return new MatrixString(newValues.length, 1, newValues);
    }

    const splitted: string[][] = this.values.map((val) => val.split(separator));

    let maxLen = 0;
    for (const arr of splitted) {
      if (arr.length > maxLen) {
        maxLen = arr.length;
      }
    }

    if (this.countCols === 1) {
      throw "splitScalar: Splitting a column vector is NotImplemenzed"
    }

    if (this.countRows === 1) {
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
      return new MatrixString(this.countCols, maxLen, newValues);
    }

    throw new Error("No free dimension to expand split result into");
  }

  public toDouble(): MatrixDouble {
    return new MatrixDouble(
      this.countRows,
      this.countCols,
      this.values.map(parseFloat),
    );
  }
}
