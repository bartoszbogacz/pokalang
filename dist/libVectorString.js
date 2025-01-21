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
    const elems = [];
    for (const v of value.values) {
        elems.push(v.split(separator));
    }
    const maxLen = Math.max(...elems.map((v) => v.length));
    const values2 = [];
    for (const elem of elems) {
        for (let i = 0; i < maxLen; i++) {
            if (i < elem.length) {
                values2.push(elem[i]);
            }
            else {
                values2.push("");
            }
        }
    }
    if (value.countRows === 1) {
        return vectorStringMake(1, 1, maxLen, values2);
    }
    else if (value.countCols === 1) {
        return vectorStringMake(1, value.countRows, maxLen, values2);
    }
    else if (value.countPages === 1) {
        return vectorStringMake(value.countCols, value.countRows, maxLen, values2);
    }
    else {
        throw "No free dimension to expand split result into";
    }
}
function vectorStringToDouble(value) {
    return vectorDoubleMake(value.countPages, value.countRows, value.countCols, value.values.map(parseFloat));
}
