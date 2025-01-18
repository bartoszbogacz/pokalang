"use strict";
function pokaTest(expr) {
    const state = run(expr);
    const top = state.stack.pop();
    if (top === undefined) {
        throw "Stack exhausted";
    }
    if (top._type !== "ScalarBoolean") {
        throw "Test has non-boolean result";
    }
    if (top.value !== true) {
        throw "Test failed";
    }
}
pokaTest('"1 2 3,4 5 6" "," split " " split toDouble [0 col, -1 col] [[1, 4], [3, 6]] equals');
