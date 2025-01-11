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

function doubleVectorNthColumn(a: DoubleVector, n: number): DoubleVector {
    if (a.shape.length === 1) {
        if (n < 0) {
            n = a.values.length + n; 
        }
        return { shape: [1], values: [(a.values[n] as number)]};
    } else {
        throw "Not implemented";
    }
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

function doubleVectorConcatenate(values: DoubleVector[]): DoubleVector {
    const maxShapeLength = Math.max(...values.map((v) => (v.shape.length)));
    const maxShapeValue = Math.max(...values.map((v) => Math.max(...v.shape)));

    if (maxShapeLength === 1 && maxShapeValue === 1) {
        return { shape: [values.length], values: [...values.map((v) => ((v.values[0] as number)))]}
    } else {
        throw "NotImplemented";
    }
}

function doubleVectorSum(a: DoubleVector): number {
    return a.values.reduce((a, b) => (a + b));
}