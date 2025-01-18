"use strict";
function vectorDoubleMake(shape, values) {
    if (shape.reduce((a, b) => a * b) !== values.length) {
        throw "Shape does not values";
    }
    return { shape: shape, values: values };
}
function vectorDoubleShow(a) {
    return "[" + a.values.map((v) => v.toFixed(2)).join(" ") + "]";
}
function vectorDoubleNthColumn(a, n) {
    if (a.shape.length === 1) {
        throw "Vector already single column";
    }
    else if (a.shape.length === 2) {
        const colElems = a.shape[1];
        if (n < 0) {
            n = colElems + 1 + n;
        }
        const values = [];
        for (let i = 0; i < colElems; i++) {
            values.push(a.values[n * colElems + i]);
        }
        return { shape: [values.length], values: values };
    }
    else {
        throw "Not implemented";
    }
}
function vectorDoubleAddScalar(a, b) {
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] + b);
    }
    return { shape: a.shape, values: r };
}
function vectorDoubleAddVector(a, b) {
    if (a.values.length !== b.values.length) {
        throw "Shapes do not match";
    }
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] + b.values[i]);
    }
    return { shape: a.shape, values: r };
}
function vectorDoubleStackCols(values) {
    const allShapeLens = values[0].shape.length;
    for (const value of values) {
        if (value.shape.length !== allShapeLens) {
            throw "Inhomogeneous vectors";
        }
    }
    const allColLens = values[0].shape[0];
    for (const value of values) {
        if (value.shape[0] !== allColLens) {
            throw "Inhomogenous vectors";
        }
    }
    if (allShapeLens === 1) {
        const values2 = [];
        for (const value of values) {
            for (const elem of value.values) {
                values2.push(elem);
            }
        }
        return vectorDoubleMake([values.length, allColLens], values2);
    }
    else {
        throw "NotImplemented";
    }
}
function vectorDoubleSum(a) {
    return a.values.reduce((a, b) => a + b);
}
