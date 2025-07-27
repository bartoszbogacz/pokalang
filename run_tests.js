const fs = require("fs");
const path = require("path");
const vm = require("vm");

const distDir = path.join(__dirname, "dist");
const files = [
  "ScalarBoolean.js",
  "ScalarNumber.js",
  "ScalarString.js",
  "VectorBoolean.js",
  "VectorNumber.js",
  "VectorString.js",
  "MatrixBoolean.js",
  "MatrixNumber.js",
  "MatrixString.js",
  "pokaList.js",
  "pokaRecord.js",
  "pokaLexer.js",
  "pokaInterpreter.js",
  "pokaWords.js",
  "aoc2025.js",
  "pokaTestsCommon.js",
];

for (const file of files) {
  const code = fs.readFileSync(path.join(distDir, file), "utf8");
  vm.runInThisContext(code, { filename: file });
}

const output = [
  global.pokaTestsAocRun(),
  global.pokaTestsRun(),
  global.pokaDocTests4Run(),
].join("\n");
console.log(output);
if (output.includes("FAIL") || output.includes("EXC")) {
  process.exitCode = 1;
}
