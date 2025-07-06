# Contributor Guide

Poka is a very simple concatenative array programming language.
It stands for pocket calculator. Its defining feature is that it
should allow writing programs from left-to-right with minimal
backtracking of cursor position. The inline assignment of variables
`=a` and the stack forking with `{}` are an example of conveniences
allowing for that.

## Adding new words

New poka words should be added in `pokaWords.ts` by createing an dispatching
function `pokaWord$WORDNAME` and registering it in `POKA_WORDS4`. Each new
word should have documentation tests associated with it. These tests are
are added to the property `doc` as lines of poka programs which have to
leave a `PokaScalarBoolean` on top of the stack.

The dispatching function `pokaWord$WORDNAME` is responsible for stack
manipulation and type dispatching. No complex type related algorithms
should be contained in it. All operations on values where the types
are known should go to the relevant type related files, for example
`ScalarNumber.ts`, `VectorNumber.ts`, and so on.

Function on poka values where types are known should follow the naming
scheme of `poka` + `$RESULTTYPE` + `$WORD` + `$ARG1TYPE` + `$ARGNTYPE`.
For example, addition of vectors is defined as
`pokaVectorNumberAddVectorNumberVectorNumber`.

## Programming style

The implementation of the poka value functions should focus on 
classic imperative algorithms and datastructures programming.
Make the most of for-loops, if-clauses, and arrays. Use only
built-in Javascript types and functions. The near-term goal 
is to make the life easier for the Javascript optimizer and
the long-term goal is to allow easy translation to WASM where 
many conveniences, such as lambdas, are not available trivially.