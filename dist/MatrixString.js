"use strict";
class MatrixString {
    constructor(countCols, countRows, values) {
        if (countRows * countCols !== values.length) {
            throw new Error("Dimension mismatch: countCols * countRows = " +
                countRows * countCols +
                " but values.length = " +
                values.length);
        }
        this.countCols = countCols;
        this.countRows = countRows;
        this.values = values;
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
        return new MatrixString(totalRows, colCount, combinedValues);
    }
    equals(other) {
        if (this.values.length !== other.values.length) {
            return false;
        }
        const equalValues = [];
        for (let i = 0; i < this.values.length; i++) {
            equalValues.push(this.values[i] === other.values[i]);
        }
        return equalValues.reduce((a, b) => (a === b));
    }
    show() {
        const rows = [];
        for (let r = 0; r < this.countRows; r++) {
            const colValues = [];
            for (let c = 0; c < this.countCols; c++) {
                const index = r * this.countCols + c;
                colValues.push('"' + this.values[index] + '"');
            }
            rows.push("[" + colValues.join(", ") + "]");
        }
        return "[" + rows.join(", ") + "]";
    }
    splitScalar(separator) {
        if (this.countRows === 1 && this.countCols === 1) {
            const value = this.values[0];
            const newValues = [];
            for (const newVal of value.split(separator)) {
                newValues.push(newVal);
            }
            return new MatrixString(newValues.length, 1, newValues);
        }
        const splitted = this.values.map((val) => val.split(separator));
        let maxLen = 0;
        for (const arr of splitted) {
            if (arr.length > maxLen) {
                maxLen = arr.length;
            }
        }
        if (this.countCols === 1) {
            throw "splitScalar: Splitting a column vector is NotImplemenzed";
        }
        if (this.countRows === 1) {
            const newValues = [];
            for (const chunk of splitted) {
                for (let i = 0; i < maxLen; i++) {
                    if (i < chunk.length) {
                        newValues.push(chunk[i]);
                    }
                    else {
                        newValues.push("");
                    }
                }
            }
            return new MatrixString(this.countCols, maxLen, newValues);
        }
        throw new Error("No free dimension to expand split result into");
    }
    toDouble() {
        return new MatrixDouble(this.countRows, this.countCols, this.values.map(parseFloat));
    }
}
