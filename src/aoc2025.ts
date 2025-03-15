const AOC2025: {
  [key: string]: { input_text: string; input_name: string; answer: number; program: string[] };
} = {
  day1a: {
    input_text: ["3   4", "4   3", "2   5", "1   3", "3   9", "3   3"].join("\n"),
    input_name: "aoc2025day1a",
    answer: 11,
    program: [
      'aoc2025day1a "\n" split "   " split toNumber sortCols [0 col, 1 col] spread sub abs sum',
    ],
  },
  // day2a: {
  //   input_text: [
  //     "7 6 4 2 1",
  //     "1 2 7 8 9",
  //     "9 7 6 2 1",
  //     "1 3 2 4 5",
  //     "8 6 4 4 1",
  //     "1 3 6 7 9",
  //   ].join("\n"),
  //   input_name: "aoc2025day2a",
  //   answer: 2,
  //   program: ['aoc2025day2a "\n" split " " split toNumber dup 1 rotr sub'],
  // },
};
