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
    if (a._type === "ScalarDouble" && b._type === "ScalarDouble") {
        stack.push(pokaMakeScalarDouble(a.value + b.value));
    }
    else if (a._type === "VectorDouble" && b._type === "ScalarDouble") {
        stack.push(pokaMakeVectorDouble(vectorDoubleAddScalar(a.value, b.value)));
    }
    else if (a._type === "ScalarDouble" && b._type === "VectorDouble") {
        stack.push(pokaMakeVectorDouble(vectorDoubleAddScalar(b.value, a.value)));
    }
    else if (a._type === "VectorDouble" && b._type === "VectorDouble") {
        stack.push(pokaMakeVectorDouble(vectorDoubleAddVector(b.value, a.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([a, b], "add"));
    }
}
function wordCat(stack) {
    const a = stack.pop();
    const b = stack.pop();
    if (a === undefined || a._type !== "ScalarString") {
        throw "RuntimeError";
    }
    if (b === undefined || b._type !== "ScalarString") {
        throw "RuntimeError";
    }
    stack.push(pokaScalarStringMake(b.value + a.value));
}
function wordEquals(a, b) {
    if (a._type !== b._type) {
        return pokaMakeScalarBoolean(false);
    }
    if (a._type === "VectorDouble" && b._type === "VectorDouble") {
        return pokaMakeScalarBoolean(vectorDoubleEquals(a.value, b.value));
    }
    else {
        throw "NotImplemented";
    }
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
    if (a._type === "ScalarDouble" && b._type === "VectorDouble") {
        stack.push(pokaMakeVectorDouble(vectorDoubleNthColumn(b.value, a.value)));
    }
    else if (a._type === "ScalarDouble" && b._type === "VectorString") {
        // stack.push(pokaMakeVectorDouble(vectorDoubleNthColumn(b.value, a.value)));
        throw "NotImplemented";
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([a, b], "col"));
    }
}
function wordColSum(stack) {
    const a = stack.pop();
    if (a === undefined) {
        throw "colSum requires one argument";
    }
    if (a._type === "VectorDouble") {
        stack.push(pokaMakeVectorDouble(vectorDoubleColSum(a.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([a], "colSum"));
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
    if (separator._type === "ScalarString" && value._type === "ScalarString") {
        stack.push(pokaMakeVectorString(vectorStringSplitScalar(vectorStringMake(1, 1, 1, [value.value]), separator.value)));
    }
    else if (separator._type === "ScalarString" &&
        value._type === "VectorString") {
        stack.push(pokaMakeVectorString(vectorStringSplitScalar(value.value, separator.value)));
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
    if (a._type === "VectorDouble") {
        stack.push(pokaMakeScalarDouble(vectorDoubleSum(a.value)));
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
    if (value._type === "ScalarString") {
        stack.push(pokaMakeScalarDouble(parseFloat(value.value)));
    }
    else if (value._type === "VectorString") {
        stack.push(pokaMakeVectorDouble(vectorStringToDouble(value.value)));
    }
    else {
        stack.push(pokaMakeErrorNoImplFor([value], "toDouble"));
    }
}
const POKA_WORDS = {
    add: wordAdd,
    equals: pokaWord2(wordEquals),
    cat: wordCat,
    col: wordCol,
    colSum: wordColSum,
    sum: wordSum,
    split: wordSplit,
    toDouble: wordToDouble,
};
