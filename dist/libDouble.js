"use strict";
function doubleVectorMake(values) {
    return { shape: [values.length], values: values };
}
function doubleVectorShow(a) {
    return "[" + a.values.map((v) => v.toFixed(2)).join(" ") + "]";
}
function doubleVectorAddScalar(a, b) {
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] + b);
    }
    return { shape: a.shape, values: r };
}
function doubleVectorAddVector(a, b) {
    if (a.values.length !== b.values.length) {
        throw "Shapes do not match";
    }
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] + b.values[i]);
    }
    return { shape: a.shape, values: r };
}
