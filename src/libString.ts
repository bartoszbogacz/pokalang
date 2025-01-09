interface StringVector {
  shape: number[];
  values: string[];
}

function stringVectorMake(values: string[]): StringVector {
  return {
    shape: [values.length],
    values: values,
  };
}

function stringVectorShow(value: StringVector): string {
    return "[" + value.values.map((v) => '"' + v + '"').join(" ") + "]";
}

function stringScalarSplitScalar(separator: string, value: string): StringVector {
    const r = value.split(separator);
    return stringVectorMake(r);
}

function stringScalarToDouble(value: string): number {
    return parseFloat(value);    
}

function stringVectorToDouble(value: StringVector): DoubleVector {
    return {shape: value.shape, values: value.values.map(parseFloat)};
}