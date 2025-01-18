interface VectorString {
  shape: number[];
  values: string[];
}

function vectorStringMake(shape: number[], values: string[]): VectorString {
  if (shape.reduce((a, b) => a * b) !== values.length) {
    throw "Shape does not values";
  }
  return { shape: shape, values: values };
}

function vectorStringShow(value: VectorString): string {
  return "[" + value.values.map((v) => '"' + v + '"').join(" ") + "]";
}

function vectorStringSplitScalar(
  value: VectorString,
  separator: string,
): VectorString {
  if (value.shape.length === 1) {
    const rows: string[][] = [];
    for (const v of value.values) {
      rows.push(v.split(separator));
    }
    const maxRowLen = Math.max(...rows.map((v) => v.length));
    const values2: string[] = [];
    for (let i = 0; i < maxRowLen; i++) {
      for (const row of rows) {
        if (i < row.length) {
          values2.push(row[i] as string);
        } else {
          values2.push("");
        }
      }
    }
    return { shape: [maxRowLen, rows.length], values: values2 };
  } else {
    throw "NotImplemented";
  }
}

function vectorStringToDouble(value: VectorString): VectorDouble {
  return { shape: value.shape, values: value.values.map(parseFloat) };
}

function vectorStringSqueeze(value: VectorString): VectorString {
  return { shape: value.shape.filter((a) => a > 1), values: value.values };
}
