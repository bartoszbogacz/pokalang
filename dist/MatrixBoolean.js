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
function pokaMatrixBooleanShow(a) {
    const result = [];
    result.push("[");
    for (let i = 0; i < a.countRows; i++) {
        result.push(" [");
        for (let j = 0; j < a.countCols; j++) {
            result.push((a.values[i * a.countCols + j] ? "X" : ".") + ", ");
        }
        result.push("], ");
    }
    result.push("]");
    return result.join("");
}
function pokaVectorBooleanCat(values) {
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
        _type: "MatrixBoolean",
        countRows: values.length,
        countCols: firstLen,
        values: combinedValues,
    };
}
