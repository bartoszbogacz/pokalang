interface DoubleVector {
  shape: number[];
  values: number[];
}

function doubleVectorMake(values: number[]): DoubleVector {
  return { shape: [values.length], values: values };
}

function doubleVectorShow(a: DoubleVector): string {
    return "[" + a.values.map((v) => v.toFixed(2)).join(" ") + "]";
}

function doubleVectorAddScalar(a: DoubleVector, b: number): DoubleVector {
    const r: number[] = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push((a.values[i] as number) + b);
    }    
    return { shape: a.shape, values: r};
}

function doubleVectorAddVector(a: DoubleVector, b: DoubleVector): DoubleVector {
    if (a.values.length !== b.values.length) {
        throw "Shapes do not match";
    }
    const r: number[] = [];
    for (let i = 0; i < a.values.length; i++) {
        r.push((a.values[i] as number) + (b.values[i] as number));
    }    
    return { shape: a.shape, values: r};
}