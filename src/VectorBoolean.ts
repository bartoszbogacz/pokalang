interface PokaVectorBoolean {
  _type: "PokaVectorBoolean";
  values: boolean[];
}

function pokaVectorBooleanAll(a: PokaVectorBoolean): boolean {
  return a.values.reduce((a, b) => a && b);
}

function pokaVectorBooleanShow(a: PokaVectorBoolean): string {
  return "[" + a.values.map((x) => (x ? "X" : ".")).join(",") + "]";
}

function pokaVectorBooleanEqualsVectorBoolean(
  a: PokaVectorBoolean,
  b: PokaVectorBoolean,
): PokaVectorBoolean {
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push(a.values[i] === b.values[i]);
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorBooleanAndVectorBoolean(
  a: PokaVectorBoolean,
  b: PokaVectorBoolean,
): PokaVectorBoolean {
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as boolean) && (b.values[i] as boolean));
  }
  return { _type: "PokaVectorBoolean", values: r };
}

function pokaVectorBooleanCount(a: PokaVectorBoolean): number {
  let acc = 0;
  for (let i = 0; i < a.values.length; i++) {
    acc += a.values[i] ? 1 : 0;
  }
  return acc;
}
