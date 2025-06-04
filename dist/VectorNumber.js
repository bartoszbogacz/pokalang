"use strict";
function pokaVectorNumberMake(values) {
    return { _type: "PokaVectorNumber", values: values };
}
function pokaVectorNumberEqualsVectorNumber(a, b) {
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] === b.values[i]);
    }
    return { _type: "PokaVectorBoolean", values: r };
}
function pokaVectorNumberSubVectorNumber(a, b) {
    if (a.values.length !== b.values.length) {
        throw new Error("Shapes do not match.");
    }
    const newVals = [];
    for (let i = 0; i < a.values.length; i++) {
        newVals.push(a.values[i] - b.values[i]);
    }
    return pokaVectorNumberMake(newVals);
}
function pokaVectorNumberAbs(a) {
    return pokaVectorNumberMake(a.values.map(Math.abs));
}
function pokaVectorNumberAddVectorNumber(a, b) {
    if (a.values.length !== b.values.length) {
        throw new Error("Shapes do not match.");
    }
    const newVals = [];
    for (let i = 0; i < a.values.length; i++) {
        newVals.push(a.values[i] + b.values[i]);
    }
    return pokaVectorNumberMake(newVals);
}
function pokaVectorNumberSum(a) {
    return a.values.reduce((a, b) => a + b);
}
function pokaVectorNumberShow(a) {
    return "[" + a.values.map((x) => x.toFixed(2)).join(", ") + "]";
}
function pokaVectorNumberMulVectorNumber(a, b) {
    if (a.values.length !== b.values.length) {
        throw new Error("Shapes do not match.");
    }
    const newVals = [];
    for (let i = 0; i < a.values.length; i++) {
        newVals.push(a.values[i] * b.values[i]);
    }
    return pokaVectorNumberMake(newVals);
}
