interface VectorDouble {
  shape: number[];
  values: number[];
}

function vectorDoubleMake(shape: number[], values: number[]): VectorDouble {
  if (shape.reduce((a, b) => a * b) !== values.length) {
    throw "Shape does not values";
  }
  return { shape: shape, values: values };
}

function vectorDoubleShow(a: VectorDouble): string {
  return "[" + a.values.map((v) => v.toFixed(2)).join(" ") + "]";
}

function vectorDoubleNthColumn(a: VectorDouble, n: number): VectorDouble {
  if (a.shape.length === 1) {
    throw "Vector already single column";
  } else if (a.shape.length === 2) {
    const colElems = a.shape[1] as number;
    if (n < 0) {
      n = colElems + 1 + n;
    }
    const values: number[] = [];
    for (let i = 0; i < colElems; i++) {
      values.push(a.values[n * colElems + i] as number);
    }
    return { shape: [values.length], values: values };
  } else {
    throw "Not implemented";
  }
}

function vectorDoubleAddScalar(a: VectorDouble, b: number): VectorDouble {
  const r: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as number) + b);
  }
  return { shape: a.shape, values: r };
}

function vectorDoubleAddVector(a: VectorDouble, b: VectorDouble): VectorDouble {
  if (a.values.length !== b.values.length) {
    throw "Shapes do not match";
  }
  const r: number[] = [];
  for (let i = 0; i < a.values.length; i++) {
    r.push((a.values[i] as number) + (b.values[i] as number));
  }
  return { shape: a.shape, values: r };
}

function vectorDoubleStackCols(values: VectorDouble[]): VectorDouble {
  const allShapeLens = (values[0] as VectorDouble).shape.length;
  for (const value of values) {
    if (value.shape.length !== allShapeLens) {
      throw "Inhomogeneous vectors";
    }
  }

  const allColLens = (values[0] as VectorDouble).shape[0] as number;
  for (const value of values) {
    if (value.shape[0] !== allColLens) {
      throw "Inhomogenous vectors";
    }
  }

  if (allShapeLens === 1) {
    const values2: number[] = [];
    for (const value of values) {
      for (const elem of value.values) {
        values2.push(elem);
      }
    }
    return vectorDoubleMake([values.length, allColLens], values2);
  } else {
    throw "NotImplemented";
  }
}

function vectorDoubleSum(a: VectorDouble): number {
  return a.values.reduce((a, b) => a + b);
}
