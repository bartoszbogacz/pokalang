"use strict";
const POKA_WORDS2 = {
    pokaVectorNumberToVectorNumber: {
        abs: pokaVectorNumberAbs,
    },
    pokaMatrixBooleanToScalarBoolean: { all: pokaMatrixBooleanAll },
    pokaMatrixStringToMatrixNumber: { toNumber: pokaMatrixStringToNumber },
    pokaMatrixNumberToScalarNumber: {
        sum: pokaMatrixNumberSum,
    },
    pokaMatrixNumberToMatrixNumber: {
        sortRows: pokaMatrixNumberSortRows,
        transpose: pokaMatrixNumberTranspose,
        sortCols: pokaMatrixNumberSortCols,
        abs: pokaMatrixNumberAbs,
    },
    pokaScalarBooleanAndScalarBooleanToScalarBoolean: {},
    pokaScalarNumberAndScalarNumberToScalarBoolean: {},
    pokaMatrixNumberAndScalarNumberToVectorNumber: {
        col: pokaMatrixNumberColScalarNumber,
    },
    pokaScalarStringAndScalarStringToVectorString: {
        split: pokaScalarStringSplitScalarString,
    },
    pokaVectorNumberToScalarNumber: {
        sum: pokaVectorNumberSum,
    },
    pokaVectorBooleanAndVectorBooleanToVectorBoolean: {},
    pokaVectorNumberAndVectorNumberToVectorNumber: {
        sub: pokaVectorNumberSubVectorNumber,
        add: pokaVectorNumberAddVectorNumber,
    },
    pokaVectorStringAndScalarStringToMatrixString: {
        split: pokaVectorStringSplitScalarString,
    },
    pokaMatrixNumberAndMatrixNumberToMatrixBoolean: {},
    pokaMatrixNumberAndMatrixNumberToMatrixNumber: {
        sub: pokaMatrixNumberSubMatrixNumber,
        add: pokaMatrixNumberAddMatrixNumber,
    },
    pokaVectorStringAndVectorStringToVectorBoolean: {},
    pokaMatrixStringAndMatrixStringToMatrixBoolean: {},
};
const POKA_WORDS3 = {};
POKA_WORDS3["all"] = {
    doc: [
        "[True, True] all True equals",
        "[False, False] all False equals",
        "[True, False] all False equals",
    ],
    vb_sb: pokaVectorBooleanAll,
},
    POKA_WORDS3["equals"] = {
        doc: [
            "True True equals",
            "False False equals",
            "1 1 equals",
            '"a" "a" equals',
            "[True, False] [True, False] equals all",
            "[False, True] [True, False] equals all False equals",
        ],
        sb_sb_sb: (a, b) => a === b,
        sn_sn_sb: (a, b) => a === b,
        ss_ss_sb: (a, b) => a === b,
        vb_vb_vb: pokaVectorBooleanEqualsVectorBoolean,
        vs_vs_vb: pokaVectorStringEqualsVectorString,
        mn_mn_mb: pokaMatrixNumberEqualsMatrixNumber,
        ms_ms_mb: pokaMatrixStringEqualsMatrixString,
    };
function pokaDispatch2(stack, word) {
    if (word === "True") {
        stack.push(pokaMakeScalarBoolean(true));
        return;
    }
    if (word === "False") {
        stack.push(pokaMakeScalarBoolean(false));
        return;
    }
    const decl = POKA_WORDS3[word];
    if (decl === undefined) {
        throw "No such function";
    }
    const arg1 = stack.pop();
    if (arg1 === undefined) {
        throw "No implementation with no arguments";
    }
    const vector1 = pokaTryToVector(arg1);
    if (decl.vb_sb !== undefined && vector1._type === "VectorBoolean") {
        stack.push(pokaMakeScalarBoolean(decl.vb_sb(vector1.value)));
        return;
    }
    const matrix1 = pokaTryToMatrix(arg1);
    const arg2 = stack.pop();
    if (arg2 === undefined) {
        throw "No implementation with one argument";
    }
    if (decl.sb_sb_sb !== undefined && arg1._type === "ScalarBoolean" && arg2._type === "ScalarBoolean") {
        stack.push(pokaMakeScalarBoolean(decl.sb_sb_sb(arg1.value, arg2.value)));
        return;
    }
    if (decl.sn_sn_sb !== undefined && arg1._type === "ScalarNumber" && arg2._type === "ScalarNumber") {
        stack.push(pokaMakeScalarBoolean(decl.sn_sn_sb(arg1.value, arg2.value)));
        return;
    }
    if (decl.ss_ss_sb !== undefined && arg1._type === "ScalarString" && arg2._type === "ScalarString") {
        stack.push(pokaMakeScalarBoolean(decl.ss_ss_sb(arg1.value, arg2.value)));
        return;
    }
    const vector2 = pokaTryToVector(arg2);
    if (decl.vb_vb_vb !== undefined && vector1._type === "VectorBoolean" && vector2._type === "VectorBoolean") {
        stack.push(pokaMakeVectorBoolean(decl.vb_vb_vb(vector1.value, vector2.value)));
        return;
    }
    if (decl.vs_vs_vb !== undefined && vector1._type === "VectorString" && vector2._type === "VectorString") {
        stack.push(pokaMakeVectorBoolean(decl.vs_vs_vb(vector1.value, vector2.value)));
    }
    const matrix2 = pokaTryToMatrix(arg2);
    if (decl.mn_mn_mb !== undefined && matrix1._type === "MatrixNumber" && matrix2._type === "MatrixNumber") {
        stack.push(pokaMakeMatrixBoolean(decl.mn_mn_mb(matrix1.value, matrix2.value)));
        return;
    }
    if (decl.ms_ms_mb !== undefined && matrix1._type === "MatrixString" && matrix2._type === "MatrixString") {
        stack.push(pokaMakeMatrixBoolean(decl.ms_ms_mb(matrix1.value, matrix2.value)));
    }
    throw "No implementation";
}
function pokaDispatchDeprecated(stack, word) {
    const orig = stack.slice();
    try {
        pokaDispatch2(stack, word);
        return;
    }
    catch (exc) {
        //
    }
    stack.splice(0, stack.length, ...orig);
    if (word === "True") {
        stack.push(pokaMakeScalarBoolean(true));
        return;
    }
    if (word === "False") {
        stack.push(pokaMakeScalarBoolean(false));
        return;
    }
    const arg1 = stack.pop();
    if (arg1 === undefined) {
        throw "Stack underflow";
    }
    if (word === "spread") {
        if (arg1._type === "List") {
            for (const v of arg1.value) {
                stack.push(v);
            }
            return;
        }
    }
    const vector1 = pokaTryToVector(arg1);
    if (vector1._type === "VectorNumber") {
        {
            const fun = POKA_WORDS2.pokaVectorNumberToScalarNumber[word];
            if (fun != undefined) {
                const res = fun(vector1.value);
                stack.push(pokaMakeScalarNumber(res));
                return;
            }
        }
        {
            const fun = POKA_WORDS2.pokaVectorNumberToVectorNumber[word];
            if (fun != undefined) {
                const res = fun(vector1.value);
                stack.push(pokaMakeVectorNumber(res));
                return;
            }
        }
    }
    const matrix1 = pokaTryToMatrix(arg1);
    if (matrix1._type === "MatrixBoolean") {
        const fun = POKA_WORDS2.pokaMatrixBooleanToScalarBoolean[word];
        if (fun != undefined) {
            const res = fun(matrix1.value);
            stack.push(pokaMakeScalarBoolean(res));
            return;
        }
    }
    if (matrix1._type === "MatrixNumber") {
        {
            const fun = POKA_WORDS2.pokaMatrixNumberToScalarNumber[word];
            if (fun != undefined) {
                const res = fun(matrix1.value);
                stack.push(pokaMakeScalarNumber(res));
                return;
            }
        }
        {
            const fun = POKA_WORDS2.pokaMatrixNumberToMatrixNumber[word];
            if (fun != undefined) {
                const res = fun(matrix1.value);
                stack.push(pokaMakeMatrixNumber(res));
                return;
            }
        }
    }
    if (matrix1._type === "MatrixString") {
        const fun = POKA_WORDS2.pokaMatrixStringToMatrixNumber[word];
        if (fun != undefined) {
            const res = fun(matrix1.value);
            stack.push(pokaMakeMatrixNumber(res));
            return;
        }
    }
    const arg2 = stack.pop();
    if (arg2 === undefined) {
        throw "Stack underflow";
    }
    if (arg2._type === "ScalarBoolean" && arg1._type === "ScalarBoolean") {
        const fun = POKA_WORDS2.pokaScalarBooleanAndScalarBooleanToScalarBoolean[word];
        if (fun !== undefined) {
            const res = fun(arg2.value, arg1.value);
            stack.push(pokaMakeScalarBoolean(res));
            return;
        }
    }
    if (arg2._type === "ScalarNumber" && arg1._type === "ScalarNumber") {
        const fun = POKA_WORDS2.pokaScalarNumberAndScalarNumberToScalarBoolean[word];
        if (fun !== undefined) {
            const res = fun(arg2.value, arg1.value);
            stack.push(pokaMakeScalarBoolean(res));
            return;
        }
    }
    const vector2 = pokaTryToVector(arg2);
    if (arg2._type === "ScalarString" && arg1._type === "ScalarString") {
        const fun = POKA_WORDS2.pokaScalarStringAndScalarStringToVectorString[word];
        if (fun !== undefined) {
            const res = fun(arg2.value, arg1.value);
            stack.push(pokaMakeVectorString(res));
            return;
        }
    }
    if (vector2._type === "VectorString" && vector1._type === "ScalarString") {
        const fun = POKA_WORDS2.pokaVectorStringAndScalarStringToMatrixString[word];
        if (fun !== undefined) {
            const res = fun(vector2.value, vector1.value);
            stack.push(pokaMakeMatrixString(res));
            return;
        }
    }
    if (vector2._type === "VectorBoolean" && vector1._type === "VectorBoolean") {
        const fun = POKA_WORDS2.pokaVectorBooleanAndVectorBooleanToVectorBoolean[word];
        if (fun !== undefined) {
            const res = fun(vector2.value, vector1.value);
            stack.push(pokaMakeVectorBoolean(res));
            return;
        }
    }
    if (vector2._type === "VectorNumber" && vector1._type === "VectorNumber") {
        const fun = POKA_WORDS2.pokaVectorNumberAndVectorNumberToVectorNumber[word];
        if (fun !== undefined) {
            const res = fun(vector2.value, vector1.value);
            stack.push(pokaMakeVectorNumber(res));
            return;
        }
    }
    if (vector2._type === "VectorString" && vector1._type === "VectorString") {
        const fun = POKA_WORDS2.pokaVectorStringAndVectorStringToVectorBoolean[word];
        if (fun !== undefined) {
            const res = fun(vector2.value, vector1.value);
            stack.push(pokaMakeVectorBoolean(res));
            return;
        }
    }
    const matrix2 = pokaTryToMatrix(arg2);
    if (matrix2._type === "MatrixNumber" && arg1._type === "ScalarNumber") {
        const fun = POKA_WORDS2.pokaMatrixNumberAndScalarNumberToVectorNumber[word];
        if (fun !== undefined) {
            const res = fun(matrix2.value, arg1.value);
            stack.push(pokaMakeVectorNumber(res));
            return;
        }
    }
    if (matrix2._type === "MatrixNumber" && matrix1._type === "MatrixNumber") {
        {
            const fun = POKA_WORDS2.pokaMatrixNumberAndMatrixNumberToMatrixBoolean[word];
            if (fun !== undefined) {
                const res = fun(matrix2.value, matrix1.value);
                stack.push(pokaMakeMatrixBoolean(res));
                return;
            }
        }
        {
            const fun = POKA_WORDS2.pokaMatrixNumberAndMatrixNumberToMatrixNumber[word];
            if (fun !== undefined) {
                const res = fun(matrix2.value, matrix1.value);
                stack.push(pokaMakeMatrixNumber(res));
                return;
            }
        }
    }
    if (matrix2._type === "MatrixString" && matrix1._type === "MatrixString") {
        const fun = POKA_WORDS2.pokaMatrixStringAndMatrixStringToMatrixBoolean[word];
        if (fun !== undefined) {
            const res = fun(matrix2.value, matrix1.value);
            stack.push(pokaMakeMatrixBoolean(res));
            return;
        }
    }
    throw "DispatchError: " + word;
}
