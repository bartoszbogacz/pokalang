interface PokaScalarBoolean {
  _type: "ScalarBoolean";
  value: boolean;
}

function pokaScalarBooleanMake(value: boolean): PokaScalarBoolean {
  return { _type: "ScalarBoolean", value };
}

function pokaScalarBooleanEqualsScalarBoolean(
  a: PokaScalarBoolean,
  b: PokaScalarBoolean,
): PokaScalarBoolean {
  return pokaScalarBooleanMake(a.value === b.value);
}

function pokaScalarBooleanUnequalsScalarBoolean(
  a: PokaScalarBoolean,
  b: PokaScalarBoolean,
): PokaScalarBoolean {
  return pokaScalarBooleanMake(a.value !== b.value);
}

