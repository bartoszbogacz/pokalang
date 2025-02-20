interface VectorBoolean {
  _type: "VectorBoolean";
  values: boolean[];
}

function pokaVectorBooleanAll(a: VectorBoolean): boolean {
  return a.values.reduce((a, b) => a && b);
}

function pokaVectorBooleanShow(a: VectorBoolean): string {
  return "[" + a.values.map((x) => (x ? "X" : ".")).join(",") + "]";
}

function pokaVectorBooleanEqualsVectorBoolean(
  a: VectorBoolean,
  b: VectorBoolean,
): VectorBoolean {
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] === b.values[i]);
  }
  return { _type: "VectorBoolean", values: r };
}
