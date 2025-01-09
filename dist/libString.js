"use strict";
function stringVectorMake(values) {
    return {
        shape: [values.length],
        values: values,
    };
}
function stringVectorShow(value) {
    return "[" + value.values.map((v) => '"' + v + '"').join(" ") + "]";
}
function stringScalarSplitScalar(separator, value) {
    const r = value.split(separator);
    return stringVectorMake(r);
}
function stringScalarToDouble(value) {
    return parseFloat(value);
}
function stringVectorToDouble(value) {
    return { shape: value.shape, values: value.values.map(parseFloat) };
}
