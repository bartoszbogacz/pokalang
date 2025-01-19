"use strict";
function vectorStringMake(countPages, countCols, countRows, values) {
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
function vectorStringShow(value) {
    return "[" + value.values.map((v) => '"' + v + '"').join(" ") + "]";
}
function vectorStringSplitScalar(value, separator) {
    if (value.countPages > 1 || value.countCols > 1) {
        throw "NotImplemented";
    }
    const rows = [];
    for (const v of value.values) {
        rows.push(v.split(separator));
    }
    const maxRowLen = Math.max(...rows.map((v) => v.length));
    const values2 = [];
    for (let i = 0; i < maxRowLen; i++) {
        for (const row of rows) {
            if (i < row.length) {
                values2.push(row[i]);
            }
            else {
                values2.push("");
            }
        }
    }
    return vectorStringMake(1, rows.length, maxRowLen, values2);
}
function vectorStringToDouble(value) {
    return vectorDoubleMake(value.countPages, value.countRows, value.countCols, value.values.map(parseFloat));
}
