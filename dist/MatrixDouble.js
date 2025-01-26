"use strict";
class MatrixDouble {
    constructor(countRows, countCols, values) {
        if (countRows * countCols !== values.length) {
            throw new Error("Dimension mismatch: countRows * countCols = " +
                countRows * countCols +
                " but values.length = " +
                values.length);
        }
        this.countRows = countRows;
        this.countCols = countCols;
        this.values = values;
    }
    abs() {
        const newVals = this.values.map(Math.abs);
        return new MatrixDouble(this.countRows, this.countCols, newVals);
    }
    addScalar(b) {
        const newVals = [];
        for (let i = 0; i < this.values.length; i++) {
            newVals.push(this.values[i] + b);
        }
        return new MatrixDouble(this.countRows, this.countCols, newVals);
    }
    addMatrix(b) {
        if (this.countRows !== b.countRows || this.countCols !== b.countCols) {
            throw new Error("Shapes do not match for addMatrix.");
        }
        const newVals = [];
        for (let i = 0; i < this.values.length; i++) {
            newVals.push(this.values[i] + b.values[i]);
        }
        return new MatrixDouble(this.countRows, this.countCols, newVals);
    }
    static catRows(matrices) {
        const first = matrices[0];
        if (first === undefined) {
            throw new Error("Cannot concatenate an empty list of matrices.");
        }
        const colCount = first.countCols;
        for (let i = 1; i < matrices.length; i++) {
            if (matrices[i].countCols !== colCount) {
                throw new Error("Cannot concatenate matrices with different column length.");
            }
        }
        let totalRows = 0;
        for (const mat of matrices) {
            totalRows += mat.countRows;
        }
        const combinedValues = [];
        for (const mat of matrices) {
            combinedValues.push(...mat.values);
        }
        return new MatrixDouble(totalRows, colCount, combinedValues);
    }
    equals(b) {
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
    nCols() {
        return this.countCols;
    }
    nRows() {
        return this.countRows;
    }
    nthCol(n) {
        if (n < 0) {
            n = this.countCols + n;
        }
        if (n < 0 || n >= this.countCols) {
            throw new Error("Column index out of range: " + n);
        }
        const colValues = [];
        for (let r = 0; r < this.countRows; r++) {
            colValues.push(this.values[r * this.countCols + n]);
        }
        return new MatrixDouble(this.countRows, 1, colValues);
    }
    prod() {
        let product = 1;
        for (let i = 0; i < this.values.length; i++) {
            product = product * this.values[i];
        }
        return product;
    }
    show() {
        const rows = [];
        for (let r = 0; r < this.countRows; r++) {
            const colValues = [];
            for (let c = 0; c < this.countCols; c++) {
                const index = r * this.countCols + c;
                colValues.push(this.values[index].toFixed(2));
            }
            rows.push("[" + colValues.join(", ") + "]");
        }
        return "[" + rows.join(", ") + "]";
    }
    subMatrix(b) {
        if (this.countRows !== b.countRows || this.countCols !== b.countCols) {
            throw new Error("Shapes do not match for subMatrix.");
        }
        const newVals = [];
        for (let i = 0; i < this.values.length; i++) {
            newVals.push(this.values[i] - b.values[i]);
        }
        return new MatrixDouble(this.countRows, this.countCols, newVals);
    }
    subScalar(b) {
        const newVals = [];
        for (let i = 0; i < this.values.length; i++) {
            newVals.push(this.values[i] - b);
        }
        return new MatrixDouble(this.countRows, this.countCols, newVals);
    }
    sumCols() {
        const colSums = [];
        for (let i = 0; i < this.countCols; i++) {
            colSums.push(0);
        }
        for (let r = 0; r < this.countRows; r++) {
            for (let c = 0; c < this.countCols; c++) {
                colSums[c] += this.values[r * this.countCols + c];
            }
        }
        return new MatrixDouble(1, this.countCols, colSums);
    }
    sum() {
        return this.values.reduce(function (acc, val) {
            return acc + val;
        }, 0);
    }
    sortCols() {
        return this.transpose().sortRows().transpose();
    }
    sortRows() {
        const newVals = [];
        for (let r = 0; r < this.countRows; r++) {
            const start = r * this.countCols;
            const end = start + this.countCols;
            const row = this.values.slice(start, end);
            row.sort();
            newVals.push(...row);
        }
        return new MatrixDouble(this.countRows, this.countCols, newVals);
    }
    transpose() {
        const newVals = [];
        for (let c = 0; c < this.countCols; c++) {
            for (let r = 0; r < this.countRows; r++) {
                newVals.push(this.values[r * this.countCols + c]);
            }
        }
        return new MatrixDouble(this.countCols, this.countRows, newVals);
    }
}
