"use strict";
function showValue(value) {
    if (value._type === "Error") {
        return "Error: " + value.value;
    }
    else if (value._type === "DoubleScalar") {
        return value.value.toString();
    }
    else if (value._type === "DoubleVector") {
        return doubleVectorShow(value.value);
    }
    else if (value._type === "StringScalar") {
        return '"' + value.value + '"';
    }
    else if (value._type === "StringVector") {
        return stringVectorShow(value.value);
    }
    else {
        throw "Unreachable";
    }
}
function showInterpreterState(state) {
    const result = [];
    for (const value of state.stack.slice().reverse()) {
        result.push(showValue(value));
    }
    return result.join("\n");
}
function pokaMakeDoubleScalar(value) {
    return { _type: "DoubleScalar", value: value };
}
function pokaStringScalarMake(value) {
    return { _type: "StringScalar", value: value };
}
function pokaMakeDoubleVector(value) {
    return { _type: "DoubleVector", value: value };
}
function pokaMakeStringVector(value) {
    return { _type: "StringVector", value: value };
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
                .map((v) => showValue(v) + "::" + v._type)
                .join(" ")
    };
}
function pokaWord2(wordFun) {
    return function (stack) {
        const a = stack.pop();
        if (a === undefined) {
            throw "Two arguments required";
        }
        const b = stack.pop();
        if (b === undefined) {
            throw "Two arguments required";
        }
        stack.push(wordFun(a, b));
    };
}
function consumeError(state, message) {
    state.stack.push({ _type: "Error", value: message });
    state.pos = state.line.length;
}
function peekNumber(state) {
    const c = state.line.charAt(state.pos);
    return c === "-" || c >= "0" && c <= "9";
}
function consumeNumber(state) {
    const start = state.pos;
    while (true) {
        const c = state.line.charAt(state.pos);
        if (c === "-" || c >= "0" && c <= "9") {
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
        state.stack.push({ _type: "DoubleScalar", value: value });
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
    state.stack.push({ _type: "StringScalar", value: token });
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
    const valuesError = [];
    const valuesDoubleScalar = [];
    const valuesDoubleVector = [];
    const valuesStringScalar = [];
    const valuesStringVector = [];
    for (const value of values) {
        if (value._type === "DoubleScalar") {
            valuesDoubleScalar.push(value.value);
        }
        else if (value._type === "DoubleVector") {
            valuesDoubleVector.push(value.value);
        }
        else if (value._type === "StringScalar") {
            valuesStringScalar.push(value.value);
        }
        else if (value._type === "StringVector") {
            valuesStringVector.push(value.value);
        }
        else if (value._type === "Error") {
            valuesError.push(value);
        }
        else {
            throw "Unreachable";
        }
    }
    if (valuesDoubleScalar.length === values.length - valuesError.length) {
        state.stack.push(pokaMakeDoubleVector(doubleVectorMake(valuesDoubleScalar)));
    }
    else if (valuesDoubleVector.length === values.length - valuesError.length) {
        state.stack.push(pokaMakeDoubleVector(doubleVectorConcatenate(valuesDoubleVector)));
    }
    else if (valuesStringScalar.length === values.length - valuesError.length) {
        state.stack.push(pokaMakeStringVector(stringVectorMake(valuesStringScalar)));
    }
    else {
        state.stack.push({ _type: "Error", value: "Inhomogenous vector" });
    }
    for (const err of valuesError) {
        state.stack.push(err);
    }
}
function peekIdentifier(state) {
    const c = state.line.charAt(state.pos);
    return c >= "a" && c <= "z";
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
    console.log("Identifier:", '"' + token + '"');
    const wordFun = POKA_WORDS[token];
    if (wordFun === undefined) {
        state.stack.push({
            _type: "Error",
            value: "`" + token + "` identifier unknown",
        });
    }
    else {
        try {
            wordFun(state.stack);
        }
        catch (exc) {
            state.stack.push({
                _type: "Error",
                value: "" + exc,
            });
        }
    }
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
