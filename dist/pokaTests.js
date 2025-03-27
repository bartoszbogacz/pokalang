"use strict";
const POKA_TESTS = [
    '"1 2 3,4 5 6" "," split " " split [["1", "2", "3"], ["4", "5", "6"]] equals all',
    '"1 2 3,4 5 6" "," split " " split toNumber [0 cols, -1 cols] [[1, 4], [3, 6]] equals all',
    '"1 4,2 3,3 2" "," split " " split toNumber sortCols [0 cols, 1 cols] spread sub abs sum 3 equals',
];
function pokaTestsRun() {
    const result = [];
    for (const expr of POKA_TESTS) {
        try {
            const state = run(expr);
            const top = state.stack.pop();
            if (top === undefined) {
                throw "Stack exhausted";
            }
            if (top._type !== "ScalarBoolean") {
                throw "Test has non-boolean result: " + pokaShow(top);
            }
            if (top.value !== true) {
                throw "Test failed";
            }
            result.push("OK   | " + expr.replace("\n", "\\n"));
        }
        catch (exc) {
            result.push("FAIL | " + expr.replace("\n", "\\n"));
            result.push("EXC  | " + exc);
        }
    }
    return result.join("\n");
}
function pokaDocTests4Run() {
    const result = [];
    for (const [_, decl] of Object.entries(POKA_WORDS4)) {
        for (const line of decl.doc) {
            try {
                const state = run(line);
                const top = state.stack.pop();
                if (top === undefined) {
                    throw "Stack exhausted";
                }
                if (top._type !== "ScalarBoolean") {
                    throw "Test has non-boolean result: " + pokaShow(top);
                }
                if (top.value !== true) {
                    throw "Test failed";
                }
                result.push("OK   | " + line.replace("\n", "\\n"));
            }
            catch (exc) {
                result.push("FAIL | " + line.replace("\n", "\\n"));
                result.push(" EXC | " + exc);
            }
        }
    }
    return result.join("\n");
}
function pokaTestsAocRun() {
    const result = [];
    for (const [_, day] of Object.entries(AOC2025)) {
        for (const line of day.program) {
            try {
                const env = {
                    [day.input_name]: pokaScalarStringMake(day.input_text),
                };
                const state = runWithEnvironment(line, env);
                const top = state.stack.pop();
                if (top === undefined) {
                    throw "Stack exhausted";
                }
                if (top._type !== "ScalarNumber") {
                    throw "Test has non ScalarNumber result: " + pokaShow(top);
                }
                if (top.value !== day.answer) {
                    throw "Test failed";
                }
                result.push("OK   | " + line.replace("\n", "\\n"));
            }
            catch (exc) {
                result.push("FAIL | " + line.replace("\n", "\\n"));
                result.push(" EXC | " + exc);
            }
        }
    }
    return result.join("\n");
}
function pokaTestsShow() {
    const elem = document.getElementById("poka_test_results");
    if (elem === null) {
        throw "Test output div not found";
    }
    elem.innerText =
        pokaTestsAocRun() + "\n" + pokaTestsRun() + "\n" + pokaDocTests4Run();
}
pokaTestsShow();
