"use strict";
function pokaVectorStringMake(values) {
    return { _type: "VectorString", values: values };
}
function pokaScalarStringSplitScalarString(value, separator) {
    return { _type: "VectorString", values: value.split(separator) };
}
function pokaVectorStringEqualsVectorString(b, a) {
    if (a.values.length !== b.values.length) {
        throw "Shape mismatch";
    }
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] === b.values[i]);
    }
    return { _type: "VectorBoolean", values: r };
}
function pokaVectorStringShow(a) {
    return "[" + a.values.map((x) => '"' + x + '"').join(", ") + "]";
}
