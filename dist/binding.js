"use strict";
function wordAdd(stack) {
    const a = stack.pop();
    const b = stack.pop();
    if (a === undefined) {
        throw "`add` requires two arguments";
    }
    if (b === undefined) {
        throw "`add` requires two arguments";
    }
    if (a._type === "DoubleScalar" && b._type === "DoubleScalar") {
        stack.push(pokaMakeDoubleScalar(a.value + b.value));
    }
    else if (a._type === "DoubleVector" && b._type === "DoubleScalar") {
        stack.push(pokaMakeDoubleVector(doubleVectorAddScalar(a.value, b.value)));
    }
    else if (a._type === "DoubleScalar" && b._type === "DoubleVector") {
        stack.push(pokaMakeDoubleVector(doubleVectorAddScalar(b.value, a.value)));
    }
    else if (a._type === "DoubleVector" && b._type === "DoubleVector") {
        stack.push(pokaMakeDoubleVector(doubleVectorAddVector(b.value, a.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([a, b], "add"));
    }
}
function wordCat(stack) {
    const a = stack.pop();
    const b = stack.pop();
    if (a === undefined || a._type !== "StringScalar") {
        throw "RuntimeError";
    }
    if (b === undefined || b._type !== "StringScalar") {
        throw "RuntimeError";
    }
    stack.push(pokaStringScalarMake(b.value + a.value));
}
function wordCol(stack) {
    const a = stack.pop();
    const b = stack.pop();
    if (a === undefined) {
        throw "col requires two arguments";
    }
    if (b === undefined) {
        throw "col requires two arguments";
    }
    if (a._type === "DoubleScalar" && b._type === "DoubleVector") {
        stack.push(pokaMakeDoubleVector(doubleVectorNthColumn(b.value, a.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([a, b], "col"));
    }
}
function wordSplit(stack) {
    const separator = stack.pop();
    const value = stack.pop();
    if (separator === undefined) {
        throw "`split` requires two arguments";
    }
    if (value === undefined) {
        throw "`split` requires two arguments";
    }
    if (separator._type === "StringScalar" && value._type === "StringScalar") {
        stack.push(pokaMakeStringVector(stringScalarSplitScalar(separator.value, value.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([separator, value], "split"));
    }
}
function wordSum(stack) {
    const a = stack.pop();
    if (a === undefined) {
        throw "`sum` requires one argument";
    }
    if (a._type === "DoubleVector") {
        stack.push(pokaMakeDoubleScalar(doubleVectorSum(a.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([a], "sum"));
    }
}
function wordToDouble(stack) {
    const value = stack.pop();
    if (value === undefined) {
        throw "`toDouble` requires one argument";
    }
    if (value._type === "StringScalar") {
        stack.push(pokaMakeDoubleScalar(stringScalarToDouble(value.value)));
    }
    else if (value._type === "StringVector") {
        stack.push(pokaMakeDoubleVector(stringVectorToDouble(value.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([value], "toDouble"));
    }
}
const POKA_WORDS = {
    add: wordAdd,
    cat: wordCat,
    col: wordCol,
    sum: wordSum,
    split: wordSplit,
    toDouble: wordToDouble,
};
