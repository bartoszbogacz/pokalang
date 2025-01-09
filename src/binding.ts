function wordAdd(stack: PokaValue[]): void {
  const a = stack.pop();
  const b = stack.pop();

  if (a === undefined) {
    throw "`add` requires two arguments";
  }
  if (b === undefined) {
    throw "`add` requires two arguments";
  }

  if (a._type === "DoubleScalar" && b._type === "DoubleScalar") {
    stack.push(pokaDoubleScalarMake(a.value + b.value));
  } else if (a._type === "DoubleVector" && b._type === "DoubleScalar") {
    stack.push(pokaDoubleVectorMake(doubleVectorAddScalar(a.value, b.value)));
  } else if (a._type === "DoubleScalar" && b._type === "DoubleVector") {
    stack.push(pokaDoubleVectorMake(doubleVectorAddScalar(b.value, a.value)));
  } else if (a._type === "DoubleVector" && b._type === "DoubleVector") {
    stack.push(pokaDoubleVectorMake(doubleVectorAddVector(b.value, a.value)));
  } else {
    throw pokaDescribeNoImplementation([a, b], "add");
  }
}

function wordCat(stack: PokaValue[]): void {
  const a = stack.pop();
  const b = stack.pop();
  if (a === undefined || a._type !== "StringScalar") {
    throw "RuntimeError";
  }
  if (b === undefined || b._type !== "StringScalar") {
    throw "RuntimeError";
  }
  stack.push({ _type: "StringScalar", value: b.value + a.value });
}

const POKA_WORDS: { [key: string]: (stack: PokaValue[]) => void } = {
  add: wordAdd,
  cat: wordCat,
};
