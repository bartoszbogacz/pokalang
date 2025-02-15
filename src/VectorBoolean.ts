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