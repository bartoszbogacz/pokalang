interface PokaList {
  _type: "List";
  value: PokaValue[];
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
