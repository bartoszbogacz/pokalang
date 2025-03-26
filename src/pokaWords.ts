const POKA_WORDS4: { [key: string]: PokaWordDecl3 } = {};

function pokaWordAll(
  _env: { [word: string]: PokaValue },
  stack: PokaValue[],
): void {
  const a = stack.pop();

  if (a === undefined) {
    throw "Stack underflow";
  }

  const av = pokaTryToVector(a);

  if (av._type === "PokaVectorBoolean") {
    stack.push(pokaScalarBooleanMake(pokaVectorBooleanAll(av)));
    return;
  }

  const am = pokaTryToMatrix(a);

  if (am._type === "PokaMatrixBoolean") {
    stack.push(pokaScalarBooleanMake(pokaMatrixBooleanAll(am)));
    return;
  }

  throw "No implementation";
}

POKA_WORDS4["all"] = {
  doc: [
    "[True, True] all True equals",
    "[False, False] all False equals",
    "[True, False] all False equals",
    "[[True, True] [True, True]] all True equals",
    "[[True, False] [False, True]] all False equals",
  ],
  fun: pokaWordAll,
};
