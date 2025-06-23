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
      return { _type: "ScalarBoolean", value: false };
    }

    const bElem = b.value[key];
    if (bElem === undefined) {
      return { _type: "ScalarBoolean", value: false };
    }

    if (aElem._type === "ScalarBoolean" && bElem._type === "ScalarBoolean") {
      if (aElem.value !== bElem.value) {
        return { _type: "ScalarBoolean", value: false };
      }
    } else if (
      aElem._type === "ScalarNumber" &&
      bElem._type === "ScalarNumber"
    ) {
      if (aElem.value !== bElem.value) {
        return { _type: "ScalarBoolean", value: false };
      }
    } else if (
      aElem._type === "ScalarString" &&
      bElem._type === "ScalarString"
    ) {
      if (aElem.value !== bElem.value) {
        return { _type: "ScalarBoolean", value: false };
      }
    } else {
      throw "Not Implemented";
    }
  }
  return { _type: "ScalarBoolean", value: true };
}
