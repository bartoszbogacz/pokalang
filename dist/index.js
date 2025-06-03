"use strict";
function pokaShow(value) {
    if (value._type === "ScalarBoolean") {
        return value.value ? "True" : "False";
    }
    else if (value._type === "ScalarNumber") {
        return value.value.toString();
    }
    else if (value._type === "ScalarString") {
        return '"' + value.value.replace("\n", "\\n") + '"';
    }
    else if (value._type === "PokaVectorBoolean") {
        return pokaVectorBooleanShow(value);
    }
    else if (value._type === "PokaVectorNumber") {
        return pokaVectorNumberShow(value);
    }
    else if (value._type === "PokaVectorString") {
        return pokaVectorStringShow(value);
    }
    else if (value._type === "PokaMatrixBoolean") {
        return pokaMatrixBooleanShow(value);
    }
    else if (value._type === "PokaMatrixNumber") {
        return pokaMatrixNumberShow(value);
    }
    else if (value._type === "PokaMatrixString") {
        return pokaMatrixStringShow(value);
    }
    else if (value._type === "List") {
        return "[" + value.value.map(pokaShow).join(", ") + "]";
    }
    else {
        throw "Unreachable";
    }
}
function pokaInterpreterShow(state) {
    const result = [];
    for (const value of state.stack.slice().reverse()) {
        result.push(pokaShow(value));
    }
    return state.error + "\n" + result.join("\n");
}
function pokaScalarBooleanMake(value) {
    return { _type: "ScalarBoolean", value: value };
}
function pokaScalarNumberMake(value) {
    return { _type: "ScalarNumber", value: value };
}
function pokaScalarStringMake(value) {
    return { _type: "ScalarString", value: value };
}
function pokaListMake(values) {
    return { _type: "List", value: values };
}
function pokaTryToVector(value) {
    if (value._type !== "List") {
        return value;
    }
    const valuesScalarBoolean = [];
    const valuesScalarNumber = [];
    const valuesScalarString = [];
    for (const val of value.value) {
        if (val._type === "ScalarBoolean") {
            valuesScalarBoolean.push(val.value);
        }
        else if (val._type === "ScalarNumber") {
            valuesScalarNumber.push(val.value);
        }
        else if (val._type === "ScalarString") {
            valuesScalarString.push(val.value);
        }
        else {
            return value;
        }
    }
    if (valuesScalarBoolean.length === value.value.length) {
        return {
            _type: "PokaVectorBoolean",
            values: valuesScalarBoolean,
        };
    }
    else if (valuesScalarNumber.length === value.value.length) {
        return {
            _type: "PokaVectorNumber",
            values: valuesScalarNumber,
        };
    }
    else if (valuesScalarString.length === value.value.length) {
        return {
            _type: "PokaVectorString",
            values: valuesScalarString,
        };
    }
    else {
        return value;
    }
}
function pokaTryToMatrix(value) {
    if (value._type !== "List") {
        return value;
    }
    const valuesVectorBoolean = [];
    const valuesVectorNumber = [];
    const valuesVectorString = [];
    for (const val of value.value) {
        const coerced = val._type === "List" ? pokaTryToVector(val) : val;
        if (coerced._type === "PokaVectorBoolean") {
            valuesVectorBoolean.push(coerced);
        }
        else if (coerced._type === "PokaVectorNumber") {
            valuesVectorNumber.push(coerced);
        }
        else if (coerced._type === "PokaVectorString") {
            valuesVectorString.push(coerced);
        }
        else {
            return value;
        }
    }
    if (valuesVectorBoolean.length === value.value.length) {
        return pokaVectorBooleanCat(valuesVectorBoolean);
    }
    else if (valuesVectorNumber.length === value.value.length) {
        return pokaVectorNumberCat(valuesVectorNumber);
    }
    else if (valuesVectorString.length === value.value.length) {
        return pokaVectorStringCat(valuesVectorString);
    }
    else {
        return value;
    }
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
        throw "`" + token + "` is not a number.";
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
            throw "Unterminated string";
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
            throw "Stack empty in fork expression";
        }
        else {
            values.push(value);
        }
    }
    consumeLiteral(state, "]");
    state.stack = origStack;
    state.stack.push(pokaListMake(values));
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
            (c >= "0" && c <= "9") ||
            (c === ">" || c === "<")) {
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
    if (token.endsWith(">")) {
        const variableName = token.slice(0, token.length - 1);
        let value = state.env[variableName];
        if (value === undefined) {
            throw "No variable: " + variableName;
        }
        state.stack.push(value);
    }
    else {
        pokaDispatch3(state.env, state.stack, token);
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
            throw "Expected: " + literal;
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
        throw "Expected expression";
    }
    consumeWhitespace(state);
}
function pokaDispatch3(env, stack, token) {
    const word = POKA_WORDS4[token];
    if (word !== undefined) {
        word.fun(env, stack);
        return;
    }
    throw "No such function";
}
function pokaInterpreterMake(line, environment) {
    const state = {
        line: line.replace("\\n", "\n"),
        pos: 0,
        stack: [],
        error: "",
        env: {},
    };
    for (const [word, value] of Object.entries(environment)) {
        state.env[word] = value;
    }
    return state;
}
function pokaInterpreterEvaluate(state) {
    let error = "";
    try {
        while (!peekEOL(state)) {
            consumeExpression(state);
        }
    }
    catch (exc) {
        error = "" + exc;
    }
    state.error = error;
}
function pokaInterpreterInteract(state) {
    const inputDiv = document.getElementById("pokaPorts");
    if (inputDiv === null) {
        throw "No input div";
    }
    const collection = document.getElementsByClassName("PokaPortDiv");
    for (let i = 0; i < collection.length; i++) {
        const elem = collection[i];
        const portName = elem.id.slice("pokaPortDiv-".length);
        if (!(portName in state.env)) {
            elem.remove();
        }
    }
    for (const [variableName, value] of Object.entries(state.env)) {
        let elem = document.getElementById("pokaPort-" + variableName);
        if (value._type === "ScalarString")
            if (elem === null) {
                const portDiv = document.createElement("div");
                portDiv.className = "PokaPortDiv";
                portDiv.id = "pokaPortDiv-" + variableName;
                const textAreaElem = document.createElement("textarea");
                textAreaElem.className = "PokaPort";
                textAreaElem.id = "pokaPort-" + variableName;
                textAreaElem.value = value.value;
                textAreaElem.addEventListener("input", pokaOnChange);
                portDiv.appendChild(textAreaElem);
                inputDiv.appendChild(portDiv);
            }
            else {
                if (!(elem instanceof HTMLTextAreaElement)) {
                    throw "Internal error: Wrong element type";
                }
                state.env[variableName] = pokaScalarStringMake(elem.value);
            }
    }
}
function pokaOnChange() {
    const commandline = document.getElementById("pokaCommandLine");
    if (commandline === undefined || !(commandline instanceof HTMLInputElement)) {
        throw "No commandline";
    }
    const preview = document.getElementById("output_preview");
    if (preview === undefined || !(preview instanceof HTMLDivElement)) {
        throw "No preview";
    }
    const env = {};
    for (const [_, day] of Object.entries(AOC2025)) {
        env[day.input_name] = pokaScalarStringMake(day.input_text);
    }
    const state1 = pokaInterpreterMake(commandline.value, env);
    pokaInterpreterEvaluate(state1);
    pokaInterpreterInteract(state1);
    const state2 = pokaInterpreterMake(commandline.value, state1.env);
    pokaInterpreterEvaluate(state2);
    preview.innerText = pokaInterpreterShow(state2);
}
