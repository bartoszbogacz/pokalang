"use strict";
function pokaVectorStringMake(values) {
    return { _type: "PokaVectorString", values: values };
}
function pokaScalarStringSplitScalarString(value, separator) {
    return { _type: "PokaVectorString", values: value.split(separator) };
}
function pokaVectorStringEqualsVectorString(a, b) {
    if (a.values.length !== b.values.length) {
        throw "Shape mismatch";
    }
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] === b.values[i]);
    }
    return { _type: "PokaVectorBoolean", values: r };
}
function pokaVectorStringShow(a) {
    return "[" + a.values.map((x) => '"' + x + '"').join(", ") + "]";
}
function pokaVectorStringToNumber(a) {
    return pokaVectorNumberMake(a.values.map(parseFloat));
}
