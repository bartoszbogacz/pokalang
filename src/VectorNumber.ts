interface VectorNumber {
  _type: "VectorNumber";
  values: number[];
}

function pokaVectorNumberMake(values: number[]): VectorNumber {
  return { _type: "VectorNumber", values: values };
}

function pokaVectorNumberEqualsVectorNumber(
  a: VectorNumber,
  b: VectorNumber,
): VectorBoolean {
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] === b.values[i]);
  }
  return { _type: "VectorBoolean", values: r };
}
