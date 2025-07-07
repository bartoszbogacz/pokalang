interface PokaVectorString {
  _type: "PokaVectorString";
  values: string[];
}

function pokaVectorStringMake(values: string[]): PokaVectorString {
  return { _type: "PokaVectorString", values: values };
}

function pokaVectorStringFrom(value: PokaValue): PokaVectorString | null {
  if (value._type === "PokaVectorString") {
    return value;
  }
  if (value._type !== "List" || value.value.length === 0) {
    return null;
  }

  const values: string[] = [];
  for (const val of value.value) {
    if (val._type !== "ScalarString") {
      return null;
    }
    values.push(val.value);
  }

  return pokaVectorStringMake(values);
}

function pokaScalarStringSplitScalarString(
  value: string,
  separator: string,
): PokaVectorString {
  return { _type: "PokaVectorString", values: value.split(separator) };
}

function pokaVectorStringEqualsVectorString(
  a: PokaVectorString,
  b: PokaVectorString,
): PokaVectorBoolean {
  if (a.values.length !== b.values.length) {
    throw "Shape mismatch";
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] === b.values[i]);
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorStringUnequalsVectorString(
  a: PokaVectorString,
  b: PokaVectorString,
): PokaVectorBoolean {
  if (a.values.length !== b.values.length) {
    throw "Shape mismatch";
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] !== b.values[i]);
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorStringShow(a: PokaVectorString): string {
  return "[" + a.values.map((x) => '"' + x + '"').join(", ") + "]";
}

function pokaVectorStringToNumber(a: PokaVectorString): PokaVectorNumber {
  return pokaVectorNumberMake(a.values.map(parseFloat));
}

function pokaVectorStringWindows(
  a: PokaVectorString,
  size: number,
): PokaMatrixString {
  if (size <= 0 || size > a.values.length) {
    throw new Error("Invalid window size");
  }

  const countRows = a.values.length - size + 1;
  const values: string[] = [];

  for (let start = 0; start < countRows; start++) {
    for (let i = 0; i < size; i++) {
      values.push(a.values[start + i] as string);
    }
  }

  return pokaMatrixStringMake(countRows, size, values);
}

function pokaVectorStringEnumerate(a: PokaVectorString): PokaVectorNumber {
  const values: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    values.push(i);
  }
  return pokaVectorNumberMake(values);
}

function pokaVectorStringSliceScalarNumber(
  a: PokaVectorString,
  b: PokaScalarNumber,
): PokaScalarString {
  let index = Math.trunc(b.value);
  if (index < 0) {
    index = a.values.length + index;
  }
  if (index < 0 || index >= a.values.length) {
    throw new Error("Index out of range");
  }
  return pokaScalarStringMake(a.values[index] as string);
}

function pokaVectorStringSliceVectorNumber(
  a: PokaVectorString,
  b: PokaVectorNumber,
): PokaVectorString {
  const values: string[] = [];
  for (let i = 0; i < b.values.length; i++) {
    let index = Math.trunc(b.values[i] as number);
    if (index < 0) {
      index = a.values.length + index;
    }
    if (index < 0 || index >= a.values.length) {
      throw new Error("Index out of range");
    }
    values.push(a.values[index] as string);
  }
  return pokaVectorStringMake(values);
}

function pokaVectorStringSliceVectorBoolean(
  a: PokaVectorString,
  b: PokaVectorBoolean,
): PokaVectorString {
  if (a.values.length !== b.values.length) {
    throw new Error("Shape mismatch");
  }
  const values: string[] = [];
  for (let i = 0; i < a.values.length; i++) {
    if (b.values[i]) {
      values.push(a.values[i] as string);
    }
  }
  return pokaVectorStringMake(values);
}
