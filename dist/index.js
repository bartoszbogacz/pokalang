"use strict";
function pokaShow(value) {
    if (value._type === "Error") {
        return "Error: " + value.value;
    }
    else if (value._type === "ScalarBoolean") {
        return value.value ? "True" : "False";
    }
    else if (value._type === "ScalarNumber") {
        return value.value.toString();
    }
    else if (value._type === "ScalarString") {
        return '"' + value.value + '"';
    }
    else if (value._type === "VectorBoolean") {
        return "Error";
    }
    else if (value._type === "VectorNumber") {
        return "Error";
    }
    else if (value._type === "VectorString") {
        return "Error";
    }
    else if (value._type === "MatrixNumber") {
        return "Error";
    }
    else if (value._type === "MatrixString") {
        return "Error";
    }
    else if (value._type === "List") {
        return "[" + value.value.map(pokaShow).join(", ") + "]";
    }
    else {
        throw "Unreachable";
    }
}
function showInterpreterState(state) {
    const result = [];
    for (const value of state.stack.slice().reverse()) {
        result.push(pokaShow(value));
    }
    return result.join("\n");
}
function pokaMakeScalarBoolean(value) {
    return { _type: "ScalarBoolean", value: value };
}
function pokaMakeScalarNumber(value) {
    return { _type: "ScalarNumber", value: value };
}
function pokaMakeScalarString(value) {
    return { _type: "ScalarString", value: value };
}
function pokaMakeVectorBoolean(value) {
    return { _type: "VectorBoolean", value: value };
}
function pokaMakeVectorNumber(value) {
    return { _type: "VectorNumber", value: value };
}
function pokaMakeVectorString(value) {
    return { _type: "VectorString", value: value };
}
function pokaMakeMatrixBoolean(value) {
    return { _type: "MatrixBoolean", value: value };
}
function pokaMakeMatrixNumber(value) {
    return { _type: "MatrixNumber", value: value };
}
function pokaMakeMatrixString(value) {
    return { _type: "MatrixString", value: value };
}
function pokaMakeList(values) {
    return { _type: "List", value: values };
}
function pokaTryToVector(value) {
    if (value._type !== "List") {
        return value;
    }
    const valuesScalarNumber = [];
    const valuesScalarString = [];
    for (const val of value.value) {
        if (val._type === "ScalarNumber") {
            valuesScalarNumber.push(val.value);
        }
        else if (val._type === "ScalarString") {
            valuesScalarString.push(val.value);
        }
        else {
            return value;
        }
    }
    if (valuesScalarNumber.length === value.value.length) {
        return pokaMakeVectorNumber({
            _type: "VectorNumber",
            values: valuesScalarNumber,
        });
    }
    else if (valuesScalarString.length === value.value.length) {
        return pokaMakeVectorString({
            _type: "VectorString",
            values: valuesScalarString,
        });
    }
    else {
        return value;
    }
}
function pokaTryToMatrix(value) {
    if (value._type !== "List") {
        return value;
    }
    const valuesVectorNumber = [];
    const valuesVectorString = [];
    for (const val of value.value) {
        const coerced = val._type === "List" ? pokaTryToVector(val) : val;
        if (coerced._type === "VectorNumber") {
            valuesVectorNumber.push(coerced.value);
        }
        else if (coerced._type === "VectorString") {
            valuesVectorString.push(coerced.value);
        }
        else {
            return value;
        }
    }
    if (valuesVectorNumber.length === value.value.length) {
        return pokaMakeMatrixNumber(pokaVectorNumberCat(valuesVectorNumber));
    }
    else if (valuesVectorString.length === value.value.length) {
        return pokaMakeMatrixString(pokaVectorStringCat(valuesVectorString));
    }
    else {
        return value;
    }
}
function pokaMakeErrorNoImplFor(values, wordName) {
    return {
        _type: "Error",
        value: "`" +
            wordName +
            "` not implemented for: " +
            values
                .slice()
                .reverse()
                .map((v) => pokaShow(v) + "::" + v._type)
                .join(" "),
    };
}
function consumeError(state, message) {
    state.stack.push({ _type: "Error", value: message });
    state.pos = state.line.length;
}
function peekNumber(state) {
    const c = state.line.charAt(state.pos);
    return c === "-" || (c >= "0" && c <= "9");
}
function consumeNumber(state) {
    const start = state.pos;
    while (true) {
        const c = state.line.charAt(state.pos);
        if (c === "-" || (c >= "0" && c <= "9")) {
            state.pos++;
        }
        else {
            break;
        }
    }
    if (state.line.charAt(state.pos) === ".") {
        state.pos++;
        while (true) {
            const c = state.line.charAt(state.pos);
            if (c >= "0" && c <= "9") {
                state.pos++;
            }
            else {
                break;
            }
        }
    }
    if (start === state.pos) {
        throw "Expected number";
    }
    const token = state.line.slice(start, state.pos);
    const value = parseFloat(token);
    if (isNaN(value)) {
        state.stack.push({
            _type: "Error",
            value: "`" + token + "` is not a number.",
        });
    }
    else {
        state.stack.push({ _type: "ScalarNumber", value: value });
    }
}
function peekString(state) {
    return state.line.charAt(state.pos) === '"';
}
function consumeString(state) {
    if (state.line.charAt(state.pos) !== '"') {
        throw "Expected starting quote for string";
    }
    state.pos++;
    const start = state.pos;
    while (state.line.charAt(state.pos) !== '"') {
        if (state.pos >= state.line.length) {
            state.stack.push({ _type: "Error", value: "Unterminated string" });
            return;
        }
        state.pos++;
    }
    const token = state.line.slice(start, state.pos);
    state.pos++; // Skip closing quote
    console.log("String:", token);
    state.stack.push({ _type: "ScalarString", value: token });
}
function peekList(state) {
    return peekLiteral(state, "[");
}
function consumeList(state) {
    const values = [];
    const origStack = state.stack;
    consumeLiteral(state, "[");
    while (!peekLiteral(state, "]") && !peekEOL(state)) {
        state.stack = origStack.slice();
        while (!peekLiteral(state, "]") && !peekEOL(state)) {
            if (peekLiteral(state, ",")) {
                consumeLiteral(state, ",");
                break;
            }
            consumeExpression(state);
        }
        const value = state.stack.pop();
        if (value === undefined) {
            values.push({ _type: "Error", value: "Stack empty in fork expression" });
        }
        else {
            values.push(value);
        }
    }
    consumeLiteral(state, "]");
    state.stack = origStack;
    state.stack.push(pokaMakeList(values));
}
function peekIdentifier(state) {
    const c = state.line.charAt(state.pos);
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
}
function consumeIdentifer(state) {
    const start = state.pos;
    while (true) {
        const c = state.line.charAt(state.pos);
        if ((c >= "a" && c <= "z") ||
            (c >= "A" && c <= "Z") ||
            (c >= "0" && c <= "9")) {
            state.pos++;
        }
        else {
            break;
        }
    }
    if (start === state.pos) {
        throw "Expected identifier";
    }
    const token = state.line.slice(start, state.pos);
    pokaDispatch(state.stack, token);
}
function peekLiteral(state, literal) {
    for (let i = 0; i < literal.length; i++) {
        const c = state.line.charAt(state.pos + i);
        if (c !== literal.charAt(i)) {
            return false;
        }
    }
    return true;
}
function consumeLiteral(state, literal) {
    for (let i = 0; i < literal.length; i++) {
        const c = state.line.charAt(state.pos++);
        if (c !== literal.charAt(i)) {
            consumeError(state, "Expected: " + literal);
            return;
        }
    }
    console.log("Literal: " + literal);
}
function consumeWhitespace(state) {
    while (state.line.charAt(state.pos) === " ") {
        state.pos++;
    }
    console.log("Whitespace");
}
function peekEOL(state) {
    return state.pos >= state.line.length;
}
function consumeExpression(state) {
    consumeWhitespace(state);
    if (peekIdentifier(state)) {
        consumeIdentifer(state);
    }
    else if (peekNumber(state)) {
        consumeNumber(state);
    }
    else if (peekString(state)) {
        consumeString(state);
    }
    else if (peekList(state)) {
        consumeList(state);
    }
    else {
        consumeError(state, "Expected expression");
    }
    consumeWhitespace(state);
}
function run(line) {
    const state = {
        line: line,
        pos: 0,
        stack: [],
    };
    while (!peekEOL(state)) {
        consumeExpression(state);
    }
    return state;
}
function onInput(ev) {
    const target = ev.target;
    if (!(target instanceof HTMLInputElement)) {
        throw "target is: " + target;
    }
    const preview = document.getElementById("output_preview");
    if (preview === undefined || !(preview instanceof HTMLDivElement)) {
        throw "No preview";
    }
    const text = target.value;
    const state = run(text);
    preview.innerText = showInterpreterState(state);
}
