"use strict";
class MatrixString {
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
            return new MatrixString(this.countRows, maxLen, newValues);
        }
        if (this.countRows === 1) {
            throw "NotImplemented";
        }
        throw new Error("No free dimension to expand split result into");
    }
    toDouble() {
        return new MatrixDouble(this.countRows, this.countCols, this.values.map(parseFloat));
    }
}
