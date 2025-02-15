"use strict";
function pokaVectorBooleanAll(a) {
    return a.values.reduce((a, b) => a && b);
}
function pokaVectorBooleanShow(a) {
    return "[" + a.values.map((x) => (x ? "X" : ".")).join(",") + "]";
}
