"use strict";
const POKA_WORDS3 = {};
POKA_WORDS3["cols"] = {
    doc: ["[[1, 2, 3], [3, 4, 5]] [0, 1] cols [[1, 2], [3, 4]] equals all"],
    mn_vn_mn: pokaMatrixNumberColsVectorNumber,
};
POKA_WORDS3["less"] = {
    doc: [
        "[[1, 2], [3, 4]] [[5, 6], [7, 8]] less all",
        "[[1, 2], [3, 4]] 5 less all",
    ],
    mn_mn_mb: pokaMatrixNumberLessMatrixNumber,
    mn_sn_mb: pokaMatrixNumberLessScalarNumber,
};
POKA_WORDS3["equalsRows"] = {
    doc: [
        "[[1, 1, 1], [2, 3, 2], [3, 3, 3]] equalsRows [[True], [False], [True]] equals all",
    ],
    mb_mb: pokaMatrixBooleanEqualsRows,
    mn_mb: pokaMatrixNumberEqualsRows,
};
POKA_WORDS3["allRows"] = {
    doc: [
        "[[True, True, True], [True, False, True], [False, False, False]] allRows [[True], [False], [False]] equals all",
    ],
    mb_mb: pokaMatrixBooleanAllRows,
};
POKA_WORDS3["rows"] = {
    doc: ["[[1], [2], [3]] [True, False, True] rows [[1], [3]] equals all"],
    mn_vb_mn: pokaMatrixNumberRowsVectorBoolean,
};
POKA_WORDS3["squeeze"] = {
    doc: [
        "[[1], [2], [3]] squeeze [1, 2, 3] equals all",
        "[[True], [False]] squeeze [True, False] equals all",
    ],
    mb_vb: pokaMatrixBooleanSqueeze,
    mn_vn: pokaMatrixNumberSqueeze,
};
POKA_WORDS3["and"] = {
    doc: [
        "[True, False, True] [True, False, False] and [True, False, False] equals all",
    ],
    vb_vb_vb: pokaVectorBooleanAndVectorBoolean,
};
POKA_WORDS3["anyRows"] = {
    doc: [
        "[[True, True, True], [True, False, True], [False, False, False]] anyRows [[True], [True], [False]] equals all",
    ],
    mb_mb: pokaMatrixBooleanAnyRows,
};
POKA_WORDS3["unequals"] = {
    doc: [
        "[[1, 2]] [[2, 2]] unequals [[True, False]] equals all",
        "[[1, 2]] 2 unequals [[True, False]] equals all",
    ],
    mn_mn_mb: pokaMatrixNumberUnequalsMatrixNumber,
    mn_sn_mb: pokaMatrixNumberUnequalsScalarNumber,
};
POKA_WORDS3["count"] = {
    doc: [
        "[[True, False], [False, False]] count 1 equals",
        "[True, False, False] count 1 equals",
    ],
    mb_sn: pokaMatrixBooleanCount,
    vb_sn: pokaVectorBooleanCount,
};
function pokaDispatch2(env, stack, word) {
    const env_value = env[word];
    if (env_value !== undefined) {
        stack.push(env_value);
        return;
    }
    if (word === "True") {
        stack.push(pokaScalarBooleanMake(true));
        return;
    }
    if (word === "False") {
        stack.push(pokaScalarBooleanMake(false));
        return;
    }
    if (word === "id") {
        return;
    }
    if (word === "dup") {
        const a = stack.pop();
        if (a === undefined) {
            throw "dup: Stack underflow";
        }
        stack.push(a);
        stack.push(a);
        return;
    }
    if (word === "spread") {
        const arg1 = stack.pop();
        if (arg1 === undefined) {
            throw "No implementation with no arguments";
        }
        if (arg1._type === "List") {
            for (const elem of arg1.value) {
                stack.push(elem);
            }
            return;
        }
        else {
            throw "spread only implemented for List";
        }
    }
    const word4 = POKA_WORDS4[word];
    if (word4 !== undefined) {
        word4.fun(env, stack);
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
    if (decl.ss_sn !== undefined && arg1._type === "ScalarString") {
        stack.push(pokaScalarNumberMake(decl.ss_sn(arg1.value)));
        return;
    }
    if (decl.sn_sn !== undefined && arg1._type === "ScalarNumber") {
        stack.push(pokaScalarNumberMake(decl.sn_sn(arg1.value)));
        return;
    }
    const vector1 = pokaTryToVector(arg1);
    if (decl.vb_sb !== undefined && vector1._type === "PokaVectorBoolean") {
        stack.push(pokaScalarBooleanMake(decl.vb_sb(vector1)));
        return;
    }
    if (decl.vb_sn !== undefined && vector1._type === "PokaVectorBoolean") {
        stack.push(pokaScalarNumberMake(decl.vb_sn(vector1)));
        return;
    }
    if (decl.vn_sn !== undefined && vector1._type === "PokaVectorNumber") {
        stack.push(pokaScalarNumberMake(decl.vn_sn(vector1)));
        return;
    }
    if (decl.vn_vn !== undefined && vector1._type === "PokaVectorNumber") {
        stack.push(decl.vn_vn(vector1));
        return;
    }
    if (decl.vs_vn !== undefined && vector1._type === "PokaVectorString") {
        stack.push(decl.vs_vn(vector1));
        return;
    }
    const matrix1 = pokaTryToMatrix(arg1);
    if (decl.mb_mb !== undefined && matrix1._type === "PokaMatrixBoolean") {
        stack.push(decl.mb_mb(matrix1));
        return;
    }
    if (decl.mb_sb !== undefined && matrix1._type === "PokaMatrixBoolean") {
        stack.push(pokaScalarBooleanMake(decl.mb_sb(matrix1)));
        return;
    }
    if (decl.mb_sn !== undefined && matrix1._type === "PokaMatrixBoolean") {
        stack.push(pokaScalarNumberMake(decl.mb_sn(matrix1)));
        return;
    }
    if (decl.mn_sn !== undefined && matrix1._type === "PokaMatrixNumber") {
        stack.push(pokaScalarNumberMake(decl.mn_sn(matrix1)));
        return;
    }
    if (decl.mn_mb !== undefined && matrix1._type === "PokaMatrixNumber") {
        stack.push(decl.mn_mb(matrix1));
        return;
    }
    if (decl.mn_vn !== undefined && matrix1._type === "PokaMatrixNumber") {
        stack.push(decl.mn_vn(matrix1));
        return;
    }
    if (decl.mb_vb !== undefined && matrix1._type === "PokaMatrixBoolean") {
        stack.push(decl.mb_vb(matrix1));
        return;
    }
    if (decl.mn_mn !== undefined && matrix1._type === "PokaMatrixNumber") {
        stack.push(decl.mn_mn(matrix1));
        return;
    }
    if (decl.ms_mn !== undefined && matrix1._type === "PokaMatrixString") {
        stack.push(decl.ms_mn(matrix1));
        return;
    }
    const arg2 = stack.pop();
    if (arg2 === undefined) {
        throw "No implementation with one argument";
    }
    if (decl.sb_sb_sb !== undefined &&
        arg1._type === "ScalarBoolean" &&
        arg2._type === "ScalarBoolean") {
        stack.push(pokaScalarBooleanMake(decl.sb_sb_sb(arg2.value, arg1.value)));
        return;
    }
    if (decl.sn_sn_sb !== undefined &&
        arg1._type === "ScalarNumber" &&
        arg2._type === "ScalarNumber") {
        stack.push(pokaScalarBooleanMake(decl.sn_sn_sb(arg2.value, arg1.value)));
        return;
    }
    if (decl.sn_sn_sn !== undefined &&
        arg1._type === "ScalarNumber" &&
        arg2._type === "ScalarNumber") {
        stack.push(pokaScalarNumberMake(decl.sn_sn_sn(arg2.value, arg1.value)));
        return;
    }
    if (decl.ss_ss_sb !== undefined &&
        arg1._type === "ScalarString" &&
        arg2._type === "ScalarString") {
        stack.push(pokaScalarBooleanMake(decl.ss_ss_sb(arg2.value, arg1.value)));
        return;
    }
    if (decl.ss_ss_vs !== undefined &&
        arg1._type === "ScalarString" &&
        arg2._type === "ScalarString") {
        stack.push(decl.ss_ss_vs(arg2.value, arg1.value));
        return;
    }
    const vector2 = pokaTryToVector(arg2);
    if (decl.vb_vb_vb !== undefined &&
        vector1._type === "PokaVectorBoolean" &&
        vector2._type === "PokaVectorBoolean") {
        stack.push(decl.vb_vb_vb(vector2, vector1));
        return;
    }
    if (decl.vn_vn_vn !== undefined &&
        vector1._type === "PokaVectorNumber" &&
        vector2._type === "PokaVectorNumber") {
        stack.push(decl.vn_vn_vn(vector2, vector1));
        return;
    }
    if (decl.vn_vn_vb !== undefined &&
        vector1._type === "PokaVectorNumber" &&
        vector2._type === "PokaVectorNumber") {
        stack.push(decl.vn_vn_vb(vector2, vector1));
        return;
    }
    if (decl.vs_vs_vb !== undefined &&
        vector1._type === "PokaVectorString" &&
        vector2._type === "PokaVectorString") {
        stack.push(decl.vs_vs_vb(vector2, vector1));
        return;
    }
    if (decl.vs_ss_ms !== undefined &&
        arg1._type === "ScalarString" &&
        vector2._type === "PokaVectorString") {
        stack.push(decl.vs_ss_ms(vector2, arg1.value));
        return;
    }
    const matrix2 = pokaTryToMatrix(arg2);
    if (decl.mn_sn_mb !== undefined &&
        arg1._type === "ScalarNumber" &&
        matrix2._type === "PokaMatrixNumber") {
        stack.push(decl.mn_sn_mb(matrix2, arg1.value));
        return;
    }
    if (decl.mn_vn_mn !== undefined &&
        vector1._type === "PokaVectorNumber" &&
        matrix2._type === "PokaMatrixNumber") {
        stack.push(decl.mn_vn_mn(matrix2, vector1));
        return;
    }
    if (decl.mn_vb_mn !== undefined &&
        vector1._type === "PokaVectorBoolean" &&
        matrix2._type === "PokaMatrixNumber") {
        stack.push(decl.mn_vb_mn(matrix2, vector1));
        return;
    }
    if (decl.mn_mn_mb !== undefined &&
        matrix1._type === "PokaMatrixNumber" &&
        matrix2._type === "PokaMatrixNumber") {
        stack.push(decl.mn_mn_mb(matrix2, matrix1));
        return;
    }
    if (decl.mn_mn_mn !== undefined &&
        matrix1._type === "PokaMatrixNumber" &&
        matrix2._type === "PokaMatrixNumber") {
        stack.push(decl.mn_mn_mn(matrix2, matrix1));
        return;
    }
    if (decl.mn_sn_mn !== undefined &&
        arg1._type === "ScalarNumber" &&
        matrix2._type === "PokaMatrixNumber") {
        stack.push(decl.mn_sn_mn(matrix2, arg1.value));
        return;
    }
    if (decl.mn_sn_vn !== undefined &&
        arg1._type === "ScalarNumber" &&
        matrix2._type === "PokaMatrixNumber") {
        stack.push(decl.mn_sn_vn(matrix2, arg1.value));
        return;
    }
    if (decl.ms_ms_mb !== undefined &&
        matrix1._type === "PokaMatrixString" &&
        matrix2._type === "PokaMatrixString") {
        stack.push(decl.ms_ms_mb(matrix2, matrix1));
        return;
    }
    if (decl.mb_mb_mb !== undefined &&
        matrix1._type === "PokaMatrixBoolean" &&
        matrix2._type === "PokaMatrixBoolean") {
        stack.push(decl.mb_mb_mb(matrix2, matrix1));
        return;
    }
    throw "No implementation";
}
