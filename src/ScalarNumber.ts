interface PokaScalarNumber {
  _type: "ScalarNumber";
  value: number;
}

function pokaScalarNumberMake(value: number): PokaScalarNumber {
  return { _type: "ScalarNumber", value };
}

function pokaScalarNumberAddScalarNumber(
  a: PokaScalarNumber,
  b: PokaScalarNumber,
): PokaScalarNumber {
  return pokaScalarNumberMake(a.value + b.value);
}

function pokaScalarNumberSubScalarNumber(
  a: PokaScalarNumber,
  b: PokaScalarNumber,
): PokaScalarNumber {
  return pokaScalarNumberMake(a.value - b.value);
}

function pokaScalarNumberMulScalarNumber(
  a: PokaScalarNumber,
  b: PokaScalarNumber,
): PokaScalarNumber {
  return pokaScalarNumberMake(a.value * b.value);
}

function pokaScalarNumberAbs(a: PokaScalarNumber): PokaScalarNumber {
  return pokaScalarNumberMake(Math.abs(a.value));
}

function pokaScalarNumberEqualsScalarNumber(
  a: PokaScalarNumber,
  b: PokaScalarNumber,
): PokaScalarBoolean {
  return pokaScalarBooleanMake(a.value === b.value);
}

function pokaScalarNumberUnequalsScalarNumber(
  a: PokaScalarNumber,
  b: PokaScalarNumber,
): PokaScalarBoolean {
  return pokaScalarBooleanMake(a.value !== b.value);
}
