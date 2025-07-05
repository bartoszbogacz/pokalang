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
