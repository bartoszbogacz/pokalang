interface PokaScalarString {
  _type: "ScalarString";
  value: string;
}

function pokaScalarStringMake(value: string): PokaScalarString {
  return { _type: "ScalarString", value };
}

function pokaScalarStringEqualsScalarString(
  a: PokaScalarString,
  b: PokaScalarString,
): PokaScalarBoolean {
  return pokaScalarBooleanMake(a.value === b.value);
}

function pokaScalarStringUnequalsScalarString(
  a: PokaScalarString,
  b: PokaScalarString,
): PokaScalarBoolean {
  return pokaScalarBooleanMake(a.value !== b.value);
}

function pokaScalarStringToNumber(a: PokaScalarString): PokaScalarNumber {
  return pokaScalarNumberMake(parseFloat(a.value));
}
