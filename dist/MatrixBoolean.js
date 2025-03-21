"use strict";
function pokaMatrixBooleanMake(countRows, countCols, values) {
    if (countRows * countCols !== values.length) {
        throw "Shape mismatch";
    }
    return {
        _type: "PokaMatrixBoolean",
        countRows: countRows,
        countCols: countCols,
        values: values,
    };
}
function pokaMatrixBooleanAll(a) {
    return a.values.reduce((a, b) => a && b);
}
function pokaMatrixBooleanShow(a) {
    const result = [];
    result.push("[\n");
    for (let i = 0; i < a.countRows; i++) {
        result.push("  [");
        for (let j = 0; j < a.countCols; j++) {
            result.push((a.values[i * a.countCols + j] ? "True" : "False") + ", ");
        }
        result.push("],\n");
    }
    result.push("]");
    return result.join("");
}
function pokaVectorBooleanCat(values) {
    const first = values[0];
    if (first === undefined) {
        throw new Error("Cannot concatenate an empty list of vectors.");
    }
    const firstLen = first.values.length;
    for (let i = 1; i < values.length; i++) {
        if (values[i].values.length !== firstLen) {
            throw new Error("Cannot concatenate vectors with different lengths.");
        }
    }
    const combinedValues = [];
    for (const mat of values) {
        combinedValues.push(...mat.values);
    }
    return {
        _type: "PokaMatrixBoolean",
        countRows: values.length,
        countCols: firstLen,
        values: combinedValues,
    };
}
function pokaMatrixBooleanEqualsRows(a) {
    if (a.countCols === 0) {
        throw new Error("No columns");
    }
    const values = [];
    for (let i = 0; i < a.countRows; i++) {
        let acc = true;
        for (let j = 0; j < a.countCols; j++) {
            acc = acc && (a.values[i * a.countCols] === a.values[i * a.countCols + j]);
        }
        values.push(acc);
    }
    return {
        _type: "PokaMatrixBoolean",
        countRows: a.countRows,
        countCols: 1,
        values: values,
    };
}
function pokaMatrixBooleanEqualsMatrixBoolean(a, b) {
    if (a.countRows !== b.countRows || a.countCols !== b.countCols) {
        throw "Shape mismatch";
    }
    const r = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push(a.values[i] === b.values[i]);
    }
    return {
        _type: "PokaMatrixBoolean",
        countRows: a.countRows,
        countCols: a.countCols,
        values: r,
    };
}
function pokaMatrixBooleanAllRows(a) {
    if (a.countCols === 0) {
        throw new Error("No columns");
    }
    const values = [];
    for (let i = 0; i < a.countRows; i++) {
        let acc = a.values[i * a.countCols];
        for (let j = 1; j < a.countCols; j++) {
            acc = acc && a.values[i * a.countCols + j];
        }
        values.push(acc);
    }
    return {
        _type: "PokaMatrixBoolean",
        countRows: a.countRows,
        countCols: 1,
        values: values,
    };
}
function pokaMatrixBooleanSqueeze(a) {
    if (a.countCols === 1) {
        return {
            _type: "PokaVectorBoolean",
            values: a.values,
        };
    }
    else if (a.countRows === 1) {
        return {
            _type: "PokaVectorBoolean",
            values: a.values,
        };
    }
    else {
        throw new Error("Cannot squeeze");
    }
}
