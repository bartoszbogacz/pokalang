interface PokaVectorNumber {
  _type: "PokaVectorNumber";
  values: number[];
}

function pokaVectorNumberMake(values: number[]): PokaVectorNumber {
  return { _type: "PokaVectorNumber", values: values };
}

function pokaVectorNumberEqualsVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorBoolean {
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] === b.values[i]);
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorNumberSubVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorNumber {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const newVals: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    newVals.push((a.values[i] as number) - (b.values[i] as number));
  }
  return pokaVectorNumberMake(newVals);
}

function pokaVectorNumberAbs(a: PokaVectorNumber): PokaVectorNumber {
  return pokaVectorNumberMake(a.values.map(Math.abs));
}

function pokaVectorNumberAddVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorNumber {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const newVals: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    newVals.push((a.values[i] as number) + (b.values[i] as number));
  }
  return pokaVectorNumberMake(newVals);
}

function pokaVectorNumberSum(a: PokaVectorNumber): number {
  return a.values.reduce((a, b) => a + b);
}

function pokaVectorNumberShow(a: PokaVectorNumber): string {
  return "[" + a.values.map((x) => x.toFixed(2)).join(", ") + "]";
}

function pokaVectorNumberMulVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorNumber {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const newVals: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    newVals.push((a.values[i] as number) * (b.values[i] as number));
  }
  return pokaVectorNumberMake(newVals);
}
