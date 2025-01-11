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

function stringScalarSplitScalar(value: string, separator: string): StringVector {
    const r = value.split(separator);
    return stringVectorMake(r);
}

function stringVectorSplitScalar(value: StringVector, separator: string): StringVector {
    if (value.shape.length === 1) {
        const rows: string[][] = [];
        for (const v of value.values) {
            rows.push(v.split(separator));
        }
        const maxRowLen = Math.max(...rows.map((v) => v.length));
        const values2: string[] = [];
        for (const row of rows) {
            let i = 0;
            for (; i < row.length; i++) {
                values2.push(row[i] as string);
            }
            for (; i < maxRowLen; i++) {
                values2.push("");
            }
        }
        return { shape: [rows.length, maxRowLen], values: values2}
    } else {
        throw "NotImplemented";
    }
}

function stringScalarToDouble(value: string): number {
    return parseFloat(value);    
}

function stringVectorToDouble(value: StringVector): DoubleVector {
    return {shape: value.shape, values: value.values.map(parseFloat)};
}