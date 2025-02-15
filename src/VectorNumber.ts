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

function pokaVectorNumberSubVectorNumber(
  a: VectorNumber,
  b: VectorNumber,
): VectorNumber {
  if (a.values.length !== b.values.length) {
    throw new Error("Shapes do not match.");
  }
  const newVals: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    newVals.push((a.values[i] as number) - (b.values[i] as number));
  }
  return pokaVectorNumberMake(newVals);
}
