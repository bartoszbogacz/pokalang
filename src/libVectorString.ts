interface VectorString {
  countPages: number;
  countCols: number;
  countRows: number;
  values: string[];
}

function vectorStringMake(
  countPages: number,
  countCols: number,
  countRows: number,
  values: string[],
): VectorString {
  if (countPages * countCols * countRows !== values.length) {
    throw "Error";
  }
  return {
    countPages: countPages,
    countCols: countCols,
    countRows: countRows,
    values: values,
  };
}

function vectorStringShow(a: VectorString): string {
  const page: string[] = [];
  for (let i = 0; i < a.countPages; i++) {
    const row: string[] = [];
    for (let j = 0; j < a.countCols; j++) {
      const column: string[] = [];
      for (let k = 0; k < a.countRows; k++) {
        const index = a.countCols * a.countRows * i + a.countRows * j + k;
        column.push('"' + a.values[index] + '"');
      }
      row.push("[" + column.join(", ") + "]");
    }
    page.push("[" + row.join(", ") + "]");
  }
  return "[" + page.join(", ") + "]";
}


function vectorStringSplitScalar(
  value: VectorString,
  separator: string,
): VectorString {
  const elems: string[][] = [];
  for (const v of value.values) {
    elems.push(v.split(separator));
  }
  const maxLen = Math.max(...elems.map((v) => v.length));
  const values2: string[] = [];
  for (const elem of elems) {
    for (let i = 0; i < maxLen; i++) {
      if (i < elem.length) {
        values2.push(elem[i] as string);
      } else {
        values2.push("");
      }
    }
  }

  if (value.countRows === 1) {
    return vectorStringMake(1, 1, maxLen, values2);
  } else if (value.countCols === 1) {
    return vectorStringMake(1, value.countRows, maxLen, values2);
  } else if (value.countPages === 1) {
    return vectorStringMake(value.countCols, value.countRows, maxLen, values2);
  } else {
    throw "No free dimension to expand split result into";
  }
}

function vectorStringToDouble(value: VectorString): VectorDouble {
  return vectorDoubleMake(
    value.countPages,
    value.countRows,
    value.countCols,
    value.values.map(parseFloat),
  );
}
