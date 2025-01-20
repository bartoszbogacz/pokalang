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
  if (value.countPages > 1 || value.countCols > 1) {
    throw "NotImplemented";
  }

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

  throw "ContinueHere: Must spill maxRowLen to next higher dimension"
  // (1, 1, a) -> (1, maxElems, a)
  // (1, a, b) -> (maxElems, a, b)
  // (a, b, c) -> error

  return vectorStringMake(1, rows.length, maxRowLen, values2);
}

function vectorStringToDouble(value: VectorString): VectorDouble {
  return vectorDoubleMake(
    value.countPages,
    value.countRows,
    value.countCols,
    value.values.map(parseFloat),
  );
}
