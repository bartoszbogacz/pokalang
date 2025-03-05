interface PokaVectorString {
  _type: "PokaVectorString";
  values: string[];
}

function pokaVectorStringMake(values: string[]): PokaVectorString {
  return { _type: "PokaVectorString", values: values };
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

function pokaVectorStringShow(a: PokaVectorString): string {
  return "[" + a.values.map((x) => '"' + x + '"').join(", ") + "]";
}

function pokaVectorStringToNumber(a: PokaVectorString): PokaVectorNumber {
  return pokaVectorNumberMake(a.values.map(parseFloat));
}
