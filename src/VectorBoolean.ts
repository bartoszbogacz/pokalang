interface PokaVectorBoolean {
  _type: "PokaVectorBoolean";
  values: boolean[];
}

function pokaVectorBooleanMake(values: boolean[]): PokaVectorBoolean {
  return { _type: "PokaVectorBoolean", values: values };
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
  return pokaVectorBooleanMake(r);
}

function pokaVectorBooleanAndVectorBoolean(
  a: PokaVectorBoolean,
  b: PokaVectorBoolean,
): PokaVectorBoolean {
  const r: boolean[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as boolean) && (b.values[i] as boolean));
  }
  return pokaVectorBooleanMake(r);
}

function pokaVectorBooleanCount(a: PokaVectorBoolean): number {
  let acc = 0;
  for (let i = 0; i < a.values.length; i++) {
    acc += a.values[i] ? 1 : 0;
  }
  return acc;
}

function pokaVectorBooleanWindows(
  a: PokaVectorBoolean,
  size: number,
): PokaMatrixBoolean {
  if (size <= 0 || size > a.values.length) {
    throw new Error("Invalid window size");
  }

  const countRows = a.values.length - size + 1;
  const values: boolean[] = [];

  for (let start = 0; start < countRows; start++) {
    for (let i = 0; i < size; i++) {
      values.push(a.values[start + i] as boolean);
    }
  }

  return pokaMatrixBooleanMake(countRows, size, values);
}
