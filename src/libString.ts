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
