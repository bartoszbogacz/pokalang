"use strict";
function doubleVectorMake(values) {
    return { shape: [values.length], values: values };
}
function doubleVectorShow(a) {
    return "[" + a.values.map((v) => v.toFixed(2)).join(" ") + "]";
}
function doubleVectorNthColumn(a, n) {
    if (a.shape.length === 1) {
        if (n < 0) {
            n = a.values.length + n;
        }
        return { shape: [1], values: [a.values[n]] };
    }
    else {
        throw "Not implemented";
    }
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
function doubleVectorConcatenate(values) {
    const maxShapeLength = Math.max(...values.map((v) => (v.shape.length)));
    const maxShapeValue = Math.max(...values.map((v) => Math.max(...v.shape)));
    if (maxShapeLength === 1 && maxShapeValue === 1) {
        return { shape: [values.length], values: [...values.map((v) => v.values[0])] };
    }
    else {
        throw "NotImplemented";
    }
}
function doubleVectorSum(a) {
    return a.values.reduce((a, b) => (a + b));
}
