interface PokaException {
  _type: "PokaException";
  value: string;
}

function pokaExceptionMake(value: string): PokaException {
  return { _type: "PokaException", value };
}

function pokaExceptionShow(a: PokaException): PokaScalarString {
  return pokaScalarStringMake(a.value);
}
