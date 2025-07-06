function pokaRecordEqualsPokaRecord(
  a: PokaRecord,
  b: PokaRecord,
): PokaScalarBoolean {
  const allKeys = Object.keys({
    ...a.value,
    ...b.value,
  });
  for (const key of allKeys) {
    const aElem = a.value[key];
    if (aElem === undefined) {
      return pokaScalarBooleanMake(false);
    }

    const bElem = b.value[key];
    if (bElem === undefined) {
      return pokaScalarBooleanMake(false);
    }

    if (aElem._type === "ScalarBoolean" && bElem._type === "ScalarBoolean") {
      if (!pokaScalarBooleanEqualsScalarBoolean(aElem, bElem).value) {
        return pokaScalarBooleanMake(false);
      }
    } else if (
      aElem._type === "ScalarNumber" &&
      bElem._type === "ScalarNumber"
    ) {
      if (!pokaScalarNumberEqualsScalarNumber(aElem, bElem).value) {
        return pokaScalarBooleanMake(false);
      }
    } else if (
      aElem._type === "ScalarString" &&
      bElem._type === "ScalarString"
    ) {
      if (!pokaScalarStringEqualsScalarString(aElem, bElem).value) {
        return pokaScalarBooleanMake(false);
      }
    } else {
      throw "Not Implemented";
    }
  }
  return pokaScalarBooleanMake(true);
}

function pokaRecordUnequalsPokaRecord(
  a: PokaRecord,
  b: PokaRecord,
): PokaScalarBoolean {
  const eq = pokaRecordEqualsPokaRecord(a, b);
  return pokaScalarBooleanMake(!eq.value);
}

function pokaRecordGetScalarString(
  rec: PokaRecord,
  key: PokaScalarString,
): PokaValue {
  const value = rec.value[key.value];
  if (value === undefined) {
    throw "Key not in record";
  }
  return value;
}

function pokaRecordGetVectorString(
  rec: PokaRecord,
  keys: PokaVectorString,
): PokaList {
  const values: PokaValue[] = [];
  for (const key of keys.values) {
    const value = rec.value[key];
    if (value === undefined) {
      throw "Key not in record";
    }
    values.push(value);
  }
  return { _type: "List", value: values };
}

function pokaRecordGetTryVectorString(
  rec: PokaRecord,
  keys: PokaVectorString,
): PokaList {
  const values: PokaValue[] = [];
  for (const key of keys.values) {
    const value = rec.value[key];
    if (value !== undefined) {
      values.push(value);
    }
  }
  return { _type: "List", value: values };
}

function pokaRecordGetMatrixString(
  rec: PokaRecord,
  keys: PokaMatrixString,
): PokaList {
  const rows: PokaList[] = [];
  let index = 0;
  for (let r = 0; r < keys.countRows; r++) {
    const rowVals: PokaValue[] = [];
    for (let c = 0; c < keys.countCols; c++) {
      const key = keys.values[index++]!;
      const value = rec.value[key];
      if (value === undefined) {
        throw "Key not in record";
      }
      rowVals.push(value);
    }
    rows.push({ _type: "List", value: rowVals });
  }
  return { _type: "List", value: rows };
}

function pokaRecordEntryMakeScalarString(
  key: PokaScalarString,
  value: PokaValue,
): PokaRecordEntry {
  return { _type: "RecordEntry", key: key.value, value };
}

function pokaRecordEntryMakeVectorString(
  keys: PokaVectorString,
  values: PokaList,
): PokaRecord {
  if (keys.values.length !== values.value.length) {
    throw "Shape mismatch";
  }
  const rec: PokaRecord = { _type: "PokaRecord", value: {} };
  for (let i = 0; i < keys.values.length; i++) {
    const val = values.value[i];
    if (val === undefined) {
      throw "Index out of bounds";
    }
    rec.value[keys.values[i] as string] = val;
  }
  return rec;
}

function pokaRecordContainsScalarString(
  rec: PokaRecord,
  key: PokaScalarString,
): PokaScalarBoolean {
  return pokaScalarBooleanMake(rec.value[key.value] !== undefined);
}

function pokaRecordContainsVectorString(
  rec: PokaRecord,
  keys: PokaVectorString,
): PokaVectorBoolean {
  const values: boolean[] = [];
  for (const key of keys.values) {
    values.push(rec.value[key] !== undefined);
  }
  return { _type: "PokaVectorBoolean", values };
}

function pokaRecordContainsMatrixString(
  rec: PokaRecord,
  keys: PokaMatrixString,
): PokaMatrixBoolean {
  const values: boolean[] = [];
  for (const key of keys.values) {
    values.push(rec.value[key] !== undefined);
  }
  return {
    _type: "PokaMatrixBoolean",
    countRows: keys.countRows,
    countCols: keys.countCols,
    values,
  };
}
