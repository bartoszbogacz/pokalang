"use strict";
function pokaVectorNumberMake(values) {
    return { _type: "VectorNumber", values: values };
}
function pokaVectorNumberEqualsVectorNumber(a, b) {
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] === b.values[i]);
    }
    return { _type: "VectorBoolean", values: r };
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
