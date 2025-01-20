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
function vectorStringShow(a) {
    const page = [];
    for (let i = 0; i < a.countPages; i++) {
        const row = [];
        for (let j = 0; j < a.countCols; j++) {
            const column = [];
            for (let k = 0; k < a.countRows; k++) {
                const index = a.countCols * a.countRows * i + a.countRows * j + k;
                column.push('"' + a.values[index] + '"');
            }
            row.push("[" + column.join(", ") + "]");
        }
        page.push("[" + row.join(", ") + "]");
    }
    return "[" + page.join(", ") + "]";
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
    throw "ContinueHere: Must spill maxRowLen to next higher dimension";
    // (1, 1, a) -> (1, maxElems, a)
    // (1, a, b) -> (maxElems, a, b)
    // (a, b, c) -> error
    return vectorStringMake(1, rows.length, maxRowLen, values2);
}
function vectorStringToDouble(value) {
    return vectorDoubleMake(value.countPages, value.countRows, value.countCols, value.values.map(parseFloat));
}
