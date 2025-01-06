type RauteValue = {
  _typ: "StringScalar";
  value: string;
} | {
  _typ: "DoubleScalar";
  value: number;
}

function showValue(value: RauteValue): string {
  if (value._typ === "DoubleScalar") {
    return value.value.toString();
  } else if (value._typ === "StringScalar") {
    return value.value;
  } else {
    throw "Unreachable";
  }
}

interface ExecutorState {
  stack: RauteValue[];
}

function showExecutorState(state: ExecutorState): string {
  const result: string[] = [];
  for (const value of state.stack) {
    result.push(showValue(value));
  }
  return result.join("\n");
}

function executeNumber(state: ExecutorState, token: string): void {
  const value = parseFloat(token);
  if (isNaN(value)) {
    throw "Not a number";
  }
  state.stack.push({ _typ: "DoubleScalar", value: value });
}

function executeString(state: ExecutorState, token: string): void {
  // TODO
}

function executeIdentifier(state: ExecutorState, token: string): void {
  if (token === "add") {
    const a = state.stack.pop();
    const b = state.stack.pop();
    if (a === undefined || a._typ !== "DoubleScalar") {
      throw "RuntimeError";
    }
    if (b === undefined || b._typ !== "DoubleScalar") {
      throw "RuntimeError";
    }
    state.stack.push({ _typ: "DoubleScalar", value: a.value + b.value });
  } else {
    throw "Unknown identifer: " + token;
  }
}

interface ParserState {
  line: string;
  pos: number;
}

function peekNumber(state: ParserState): boolean {
  const c = state.line.charAt(state.pos);
  return c >= "0" && c <= "9";
}

function consumeNumber(state: ParserState): string {
  const start = state.pos;
  while (true) {
    const c = state.line.charAt(state.pos);
    if (c >= "0" && c <= "9") {
      state.pos++;
    } else {
      break;
    }
  }
  if (state.line.charAt(state.pos) === ".") {
    state.pos++;
    while (true) {
      const c = state.line.charAt(state.pos);
      if (c >= "0" && c <= "9") {
        state.pos++;
      } else {
        break;
      }
    }
  }
  if (start === state.pos) {
    throw "Expected number";
  }
  const result = state.line.slice(start, state.pos);
  console.log("Number:", result);
  return result;
}

function peekString(state: ParserState): boolean {
  return state.line.charAt(state.pos) === '"';
}

function consumeString(state: ParserState): string {
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
  const result = state.line.slice(start, state.pos);
  state.pos++; // Skip closing quote
  consumeWhitespace(state);
  console.log("String:", result);
  return result;
}

function peekIdentifier(state: ParserState): boolean {
  const c = state.line.charAt(state.pos);
  return c >= "a" && c <= "z";
}

function consumeIdentifer(state: ParserState): string {
  const start = state.pos;
  while (true) {
    const c = state.line.charAt(state.pos);
    if (
      (c >= "a" && c <= "z") ||
      (c >= "A" && c <= "Z") ||
      (c >= "0" && c <= "9")
    ) {
      state.pos++;
    } else {
      break;
    }
  }
  if (start === state.pos) {
    throw "Expected identifier";
  }
  const result = state.line.slice(start, state.pos);
  console.log("Identifier:", '"' + result + '"');
  return result;
}

function peekLiteral(state: ParserState, literal: string): boolean {
  for (let i = 0; i < literal.length; i++) {
    const c = state.line.charAt(state.pos + i);
    if (c !== literal.charAt(i)) {
      return false;
    }
  }
  return true;
}

function consumeLiteral(state: ParserState, literal: string): void {
  for (let i = 0; i < literal.length; i++) {
    const c = state.line.charAt(state.pos++);
    if (c !== literal.charAt(i)) {
      throw "Unexpected character";
    }
  }
  console.log("Literal: " + literal);
}

function peekAllButLiteral(state: ParserState, literal: string): boolean {
  for (let i = 0; i < literal.length; i++) {
    const c = state.line.charAt(state.pos + i);
    if (c === literal.charAt(i)) {
      return false;
    }
  }
  return true;
}

function consumeWhitespace(state: ParserState): void {
  while (state.line.charAt(state.pos) === " ") {
    state.pos++;
  }
  console.log("Whitespace");
}

function peekEOL(state: ParserState): boolean {
  return state.pos >= state.line.length;
}

function run(line: string): ExecutorState {
  const executorState: ExecutorState = {
    stack: [],
  }

  const parserState: ParserState = {
    line: line,
    pos: 0,
  };

  while (peekEOL(parserState) === false) {
    if (peekIdentifier(parserState)) {
      const identiferToken = consumeIdentifer(parserState);
      executeIdentifier(executorState, identiferToken);
    } else if (peekNumber(parserState)) {
      const numberToken = consumeNumber(parserState);
      executeNumber(executorState, numberToken);
    } else if (peekString(parserState)) {
      const stringToken = consumeString(parserState);
      executeString(executorState, stringToken);
    } else {
      throw "Unexpected symbol: " + parserState.line.slice(parserState.pos);
    }
    consumeWhitespace(parserState);
  }

  return executorState;
}

function onInput(ev: InputEvent) {
  const target = ev.target;
  if (!(target instanceof HTMLInputElement)) {
    throw "target is: " + target;
  }
  const preview = document.getElementById("output_preview");
  if (preview === undefined || !(preview instanceof HTMLDivElement)) {
    throw "No preview";
  }
  const text = target.value;
  const executorState = run(text);
  preview.innerText = showExecutorState(executorState);
}