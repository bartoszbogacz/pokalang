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
        stack.push(pokaDoubleScalarMake(a.value + b.value));
    }
    else if (a._type === "DoubleVector" && b._type === "DoubleScalar") {
        stack.push(pokaDoubleVectorMake(doubleVectorAddScalar(a.value, b.value)));
    }
    else if (a._type === "DoubleScalar" && b._type === "DoubleVector") {
        stack.push(pokaDoubleVectorMake(doubleVectorAddScalar(b.value, a.value)));
    }
    else if (a._type === "DoubleVector" && b._type === "DoubleVector") {
        stack.push(pokaDoubleVectorMake(doubleVectorAddVector(b.value, a.value)));
    }
    else {
        throw pokaShowNoImplFor([a, b], "add");
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
        stack.push(pokaStringVectorMake(stringScalarSplitScalar(separator.value, value.value)));
    }
    else {
        throw pokaShowNoImplFor([separator, value], "split");
    }
}
function wordToDouble(stack) {
    const value = stack.pop();
    if (value === undefined) {
        throw "`toDouble` requires one argument";
    }
    if (value._type === "StringScalar") {
        stack.push(pokaDoubleScalarMake(stringScalarToDouble(value.value)));
    }
    else if (value._type === "StringVector") {
        stack.push(pokaDoubleVectorMake(stringVectorToDouble(value.value)));
    }
    else {
        throw pokaShowNoImplFor([value], "toDouble");
    }
}
const POKA_WORDS = {
    add: wordAdd,
    cat: wordCat,
    split: wordSplit,
    toDouble: wordToDouble,
};
