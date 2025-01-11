"use strict";
function stringVectorMake(values) {
    return {
        shape: [values.length],
        values: values,
    };
}
function stringVectorShow(value) {
    return "[" + value.values.map((v) => '"' + v + '"').join(" ") + "]";
}
function stringScalarSplitScalar(value, separator) {
    const r = value.split(separator);
    return stringVectorMake(r);
}
function stringVectorSplitScalar(value, separator) {
    if (value.shape.length === 1) {
        const rows = [];
        for (const v of value.values) {
            rows.push(v.split(separator));
        }
        const maxRowLen = Math.max(...rows.map((v) => v.length));
        const values2 = [];
        for (const row of rows) {
            let i = 0;
            for (; i < row.length; i++) {
                values2.push(row[i]);
            }
            for (; i < maxRowLen; i++) {
                values2.push("");
            }
        }
        return { shape: [rows.length, maxRowLen], values: values2 };
    }
    else {
        throw "NotImplemented";
    }
}
function stringScalarToDouble(value) {
    return parseFloat(value);
}
function stringVectorToDouble(value) {
    return { shape: value.shape, values: value.values.map(parseFloat) };
}
