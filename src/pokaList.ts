interface PokaList {
  _type: "List";
  value: PokaValue[];
}

function pokaListTryFrom(value: PokaValue): PokaList | null {
  if (value._type === "List") {
    return value;
  }
  if (value._type === "PokaVectorBoolean") {
    return {
      _type: "List",
      value: value.values.map((v) => pokaScalarBooleanMake(v)),
    };
  }
  if (value._type === "PokaVectorNumber") {
    return {
      _type: "List",
      value: value.values.map((v) => pokaScalarNumberMake(v)),
    };
  }
  if (value._type === "PokaVectorString") {
    return {
      _type: "List",
      value: value.values.map((v) => pokaScalarStringMake(v)),
    };
  }
  if (value._type === "PokaRecord") {
    const entries: PokaRecordEntry[] = [];
    for (const [key, val] of Object.entries(value.value)) {
      entries.push({ _type: "RecordEntry", key, value: val });
    }
    return { _type: "List", value: entries };
  }
  return null;
}

function pokaListEqualsPokaList(a: PokaList, b: PokaList): PokaScalarBoolean {
  if (a.value.length !== b.value.length) {
    return pokaScalarBooleanMake(false);
  }
  for (let i = 0; i < a.value.length; i++) {
    const ae = a.value[i];
    const be = b.value[i];
    if (ae === undefined || be === undefined) {
      throw "Index out of bounds";
    }
    if (ae._type === "ScalarBoolean" && be._type === "ScalarBoolean") {
      if (!pokaScalarBooleanEqualsScalarBoolean(ae, be).value) {
        return pokaScalarBooleanMake(false);
      }
    } else if (ae._type === "ScalarNumber" && be._type === "ScalarNumber") {
      if (!pokaScalarNumberEqualsScalarNumber(ae, be).value) {
        return pokaScalarBooleanMake(false);
      }
    } else if (ae._type === "ScalarString" && be._type === "ScalarString") {
      if (!pokaScalarStringEqualsScalarString(ae, be).value) {
        return pokaScalarBooleanMake(false);
      }
    } else {
      throw "Not Implemented";
    }
  }
  return pokaScalarBooleanMake(true);
}

function pokaListUnequalsPokaList(a: PokaList, b: PokaList): PokaScalarBoolean {
  const eq = pokaListEqualsPokaList(a, b);
  return pokaScalarBooleanMake(!eq.value);
}

function pokaListEnumerate(a: PokaList): PokaVectorNumber {
  const values: number[] = [];
  for (let i = 0; i < a.value.length; i++) {
    values.push(i);
  }
  return pokaVectorNumberMake(values);
}

function pokaListSpread(a: PokaList): PokaValue[] {
  return a.value.slice();
}

function pokaListSliceScalarNumber(a: PokaList, b: PokaScalarNumber): PokaValue {
  let index = Math.trunc(b.value);
  if (index < 0) {
    index = a.value.length + index;
  }
  if (index < 0 || index >= a.value.length) {
    throw new Error("Index out of range");
  }
  const result = a.value[index];
  if (result === undefined) {
    throw new Error("Index out of bounds");
  }
  return result;
}

function pokaListSliceVectorNumber(
  a: PokaList,
  b: PokaVectorNumber,
): PokaList {
  const values: PokaValue[] = [];
  for (let i = 0; i < b.values.length; i++) {
    let index = Math.trunc(b.values[i] as number);
    if (index < 0) {
      index = a.value.length + index;
    }
    if (index < 0 || index >= a.value.length) {
      throw new Error("Index out of range");
    }
    const elem = a.value[index];
    if (elem === undefined) {
      throw new Error("Index out of bounds");
    }
    values.push(elem);
  }
  return { _type: "List", value: values };
}

function pokaListSliceVectorBoolean(
  a: PokaList,
  b: PokaVectorBoolean,
): PokaList {
  if (b.values.length !== a.value.length) {
    throw new Error("Shape mismatch");
  }
  const values: PokaValue[] = [];
  for (let i = 0; i < a.value.length; i++) {
    if (b.values[i]) {
      const elem = a.value[i];
      if (elem === undefined) {
        throw new Error("Index out of bounds");
      }
      values.push(elem);
    }
  }
  return { _type: "List", value: values };
}
