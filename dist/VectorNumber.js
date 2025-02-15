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
