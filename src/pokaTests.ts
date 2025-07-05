
function pokaTestsShow(): void {
  const elem = document.getElementById("poka_test_results");
  if (elem === null) {
    throw "Test output div not found";
  }
  elem.innerText =
    pokaTestsAocRun() + "\n" + pokaTestsRun() + "\n" + pokaDocTests4Run();
}

pokaTestsShow();
