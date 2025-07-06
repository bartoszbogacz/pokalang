const AOC2025: {
  [key: string]: {
    input_text: string;
    input_name: string;
    answer: number;
    program: string[];
  };
} = {
  day1a: {
    input_text: ["3   4", "4   3", "2   5", "1   3", "3   9", "3   3"].join(
      "\n",
    ),
    input_name: "aoc2025day1a",
    answer: 11,
    program: [
      '$aoc2025day1a "\n" split "   " split toNumber sortCols [0 cols, 1 cols] spread sub abs sum',
    ],
  },
  day2a: {
    input_text: [
      "7 6 4 2 1",
      "1 2 7 8 9",
      "9 7 6 2 1",
      "1 3 2 4 5",
      "8 6 4 4 1",
      "1 3 6 7 9",
    ].join("\n"),
    input_name: "aoc2025day2a",
    answer: 2,
    program: [
      '$aoc2025day2a "\n" split " " split toNumber dup 1 rotr sub [0, 1, 2, 3] cols [0 unequals allRows squeeze, 0 less equalsRows squeeze, abs 4 less allRows squeeze] spread and and count',
    ],
  },
  day3a: {
    input_text:
      "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))",
    input_name: "aoc2025day3a",
    answer: 161,
    program: [
      '$aoc2025day3a "mul\\((\\d+),(\\d+)\\)" match {0 cols toNumber, 1 cols toNumber} mul sum',
    ],
  },
  day4a: {
    program: [
      '"275,47,61,53,29" "," split dup enumerate entry "47|53 97|13 97|61 97|47 75|29 61|13 75|53 29|13 97|29 53|29 61|53 97|53 61|29 47|13 75|47 97|75 47|61 75|61 47|29 75|13 53|13" " " split "|" split {contains allRows squeeze} slice get {0 cols, 1 cols} greater',
    ]
  }
};
