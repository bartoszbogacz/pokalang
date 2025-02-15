interface VectorString {
  _type: "VectorString";
  values: string[];
}

function pokaVectorStringMake(values: string[]): VectorString {
  return { _type: "VectorString", values: values };
}

function pokaScalarStringSplitScalarString(
  value: string,
  separator: string,
): VectorString {
  return { _type: "VectorString", values: value.split(separator) };
}

function pokaVectorStringEqualsVectorString(
  a: VectorString,
  b: VectorString,
): VectorBoolean {
  if (a.values.length !== b.values.length) {
    throw "Shape mismatch";
  }
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] === b.values[i]);
  }
  return { _type: "VectorBoolean", values: r };
}
