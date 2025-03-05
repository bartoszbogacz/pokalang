"use strict";
function pokaVectorBooleanAll(a) {
    return a.values.reduce((a, b) => a && b);
}
function pokaVectorBooleanShow(a) {
    return "[" + a.values.map((x) => (x ? "X" : ".")).join(",") + "]";
}
function pokaVectorBooleanEqualsVectorBoolean(a, b) {
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] === b.values[i]);
    }
    return { _type: "PokaVectorBoolean", values: r };
}
