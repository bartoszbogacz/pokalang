function pokaTestRunDocTest(testName: string, lines: string[]): string {
  const env: { [word: string]: PokaValue } = {};
  const sections: string[] = lines.join("\n").split("\n\n");
  for (const section of sections) {
    if (!section.startsWith(">>>")) {
      continue;
    }

    const linesTest: string[] = [];
    const linesResult: string[] = [];
    let readingResult: boolean = false;
    for (const line of section) {
      if (
        !readingResult &&
        !line.startsWith(">>>") &&
        !line.startsWith("...")
      ) {
        readingResult = true;
      }
      if (readingResult === true) {
        linesTest.push(line.slice(4));
      } else {
        linesResult.push(line.slice(4));
      }
    }

    try {
      const testResult = pokaInterpreterEvaluate(env, linesTest.join("\n"));

      if (testResult !== linesResult.join("\n")) {
        return (
          "Failed doctest.\n     In:\n" +
          linesTest.join("\n") +
          "\n    Expected:\n" +
          linesResult.join("\n") +
          "\n    Got:\n" +
          testResult
        );
      }
    } catch (exc) {
      return (
        "Failed doctest.\n     In:\n" +
        linesTest.join("\n") +
        "\n    Expected:\n" +
        linesResult.join("\n") +
        "\n    Got Exception:\n" +
        ("" + exc)
      );
    }
  }

  return "  OK | " + testName;
}

function pokaTestRunDoc(testName: string, lines: string[]): string {
  for (const line of lines) {
    let testResult: string = "";

    try {
      testResult = pokaInterpreterEvaluate({}, line);
    } catch (exc) {
      return (
        "    In:\n" +
        line +
        "\n    Expected:\ntrue\n    Got Exception:\n" +
        ("" + exc)
      );
    }

    if (!testResult.startsWith("true")) {
      return (
        "    In:\n" + line + "\n    Expected:\ntrue\n    Got:\n" + testResult
      );
    }
  }
  return "  OK | " + testName;
}

function pokaTestsRun(): string {
  const testResults: string[] = [];
  for (const [wordName, decl] of Object.entries(POKA_WORDS4)) {
    if (decl.docTest !== undefined) {
      testResults.push(pokaTestRunDocTest(wordName, decl.docTest));
    }
    if (decl.doc !== undefined) {
      testResults.push(pokaTestRunDoc(wordName, decl.doc));
    }
  }
  return testResults.join("\n");
}

function pokaTestsRunAoc(): string {
  const testResults: string[] = [];
  for (const [dayName, day] of Object.entries(AOC2025)) {
    const env: { [word: string]: PokaValue } = {
      [day.input_name]: pokaScalarStringMake(day.input_text),
    };

    let testResult: string = "";

    try {
      testResult = pokaInterpreterEvaluate(env, day.program.join("\n"));
    } catch (exc) {
      return (
        "    In:\n" +
        day.program.join("\n") +
        "\n    Expected:\ntrue\n    Got Exception:\n" +
        ("" + exc)
      );
    }

    if (!testResult.startsWith("" + day.answer)) {
      return (
        "    In:\n" +
        day.program.join("\n") +
        "\n    Expected:\ntrue\n    Got:\n" +
        testResult
      );
    }

    testResults.push("  OK | " + dayName);
  }
  return testResults.join("\n");
}
