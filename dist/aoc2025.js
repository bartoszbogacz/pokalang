"use strict";
const AOC2025 = {
    day1a: {
        input: ["3   4", "4   3", "2   5", "1   3", "3   9", "3   3"].join("\n"),
        answer: 11,
        program: ['"\n" split "   " split toNumber sortCols [0 col, 1 col] spread sub abs sum'],
    },
    day2a: {
        input: [
            "7 6 4 2 1",
            "1 2 7 8 9",
            "9 7 6 2 1",
            "1 3 2 4 5",
            "8 6 4 4 1",
            "1 3 6 7 9",
        ].join("\n"),
        answer: 2,
        program: ['"\n" split " " split toNumber dup 1 rotr sub'],
    },
};
