"use strict";
function pokaMatrixBooleanMake(countRows, countCols, values) {
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
function pokaMatrixBooleanAll(a) {
    return a.values.reduce((a, b) => a && b);
}
