interface PokaVectorNumber {
  _type: "PokaVectorNumber";
  values: number[];
}

function pokaVectorNumberMake(values: number[]): PokaVectorNumber {
  return { _type: "PokaVectorNumber", values: values };
}

function pokaVectorNumberFrom(value: PokaValue): PokaVectorNumber | null {
  if (value._type === "PokaVectorNumber") {
    return value;
  }
  if (value._type !== "List" || value.value.length === 0) {
    return null;
  }

  const values: number[] = [];
  for (const val of value.value) {
    if (val._type !== "ScalarNumber") {
      return null;
    }
    values.push(val.value);
  }

  return pokaVectorNumberMake(values);
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

function pokaVectorNumberUnequalsVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorBoolean {
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] !== b.values[i]);
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

function pokaVectorNumberGreaterVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorBoolean {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as number) > (b.values[i] as number));
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorNumberGreaterEqualsVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorBoolean {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as number) >= (b.values[i] as number));
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorNumberLesserVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorBoolean {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as number) < (b.values[i] as number));
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorNumberLesserEqualsVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorBoolean {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as number) <= (b.values[i] as number));
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorNumberEnumerate(a: PokaVectorNumber): PokaVectorNumber {
  const values: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values.push(i);
  }
  return pokaVectorNumberMake(values);
}

function pokaVectorNumberWindows(
  a: PokaVectorNumber,
  size: number,
): PokaMatrixNumber {
  if (size <= 0 || size > a.values.length) {
    throw new Error("Invalid window size");
  }

  const countRows = a.values.length - size + 1;
  const values: number[] = [];

  for (let start = 0; start < countRows; start++) {
    for (let i = 0; i < size; i++) {
      values.push(a.values[start + i] as number);
    }
  }

  return pokaMatrixNumberMake(countRows, size, values);
}

function pokaVectorNumberSliceScalarNumber(
  a: PokaVectorNumber,
  b: PokaScalarNumber,
): PokaScalarNumber {
  let index = Math.trunc(b.value);
  if (index < 0) {
    index = a.values.length + index;
  }
  if (index < 0 || index >= a.values.length) {
    throw new Error("Index out of range");
  }
  return pokaScalarNumberMake(a.values[index] as number);
}

function pokaVectorNumberSliceVectorNumber(
  a: PokaVectorNumber,
  b: PokaVectorNumber,
): PokaVectorNumber {
  const values: number[] = [];
  for (let i = 0; i < b.values.length; i++) {
    let index = Math.trunc(b.values[i] as number);
    if (index < 0) {
      index = a.values.length + index;
    }
    if (index < 0 || index >= a.values.length) {
      throw new Error("Index out of range");
    }
    values.push(a.values[index] as number);
  }
  return pokaVectorNumberMake(values);
}

function pokaVectorNumberSliceVectorBoolean(
  a: PokaVectorNumber,
  b: PokaVectorBoolean,
): PokaVectorNumber {
  if (a.values.length !== b.values.length) {
    throw new Error("Shape mismatch");
  }
  const values: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    if (b.values[i]) {
      values.push(a.values[i] as number);
    }
  }
  return pokaVectorNumberMake(values);
}
