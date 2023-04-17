import { BitNode, build, iterate, prune, truncate } from "./bit-tree";

const getTree = (tree: BitNode) => [...iterate(tree)].map(({ bits }) => bits);

describe("BitNode", () => {
  describe("insert", () => {
    const cases = [
      { bits: [[]], want: { count: 1 } },
      { bits: [[0]], want: { count: 1, zero: { count: 1 } } },
      { bits: [[1]], want: { count: 1, one: { count: 1 } } },
      { bits: [[0], [1]], want: { count: 2 } },
    ];
    for (const { bits, want } of cases) {
      it(`should insert ${JSON.stringify(bits)}`, () => {
        expect(build(bits)).toEqual(want);
      });
    }
  });

  describe("iterate", () => {
    const cases = [
      { bits: [[]], want: [[]] },
      { bits: [[1]], want: [[1]] },
      { bits: [[0], [1]], want: [[]] },
    ];
    for (const { bits, want } of cases) {
      it(`should iterate ${JSON.stringify(bits)}`, () => {
        expect(getTree(build(bits))).toEqual(want);
      });
    }
  });

  describe("truncate", () => {
    const cases = [
      { bits: [[]], want: [[]], depth: 0 },
      { bits: [[1]], want: [[1]], depth: 0 },
      {
        bits: [
          [1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 1, 1],
        ],
        want: [[1, 1]],
        depth: 2,
      },
    ];

    for (const { bits, want, depth } of cases) {
      it(`should truncate ${JSON.stringify(bits)} at ${depth}`, () => {
        expect(getTree(truncate(build(bits), depth))).toEqual(want);
      });
    }
  });

  describe("prune", () => {
    const cases = [
      { bits: [[]], want: [[]], depth: 10 },
      { bits: [[1]], want: [[1]], depth: 10 },
      {
        bits: [
          [1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 1, 1],
        ],
        want: [[1, 1]],
        depth: 2,
      },
      {
        bits: [
          [1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 1, 1],
        ],
        want: [[1, 1]],
        depth: 3,
      },
      {
        bits: [
          [1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 1, 1],
        ],
        want: [
          [1, 1, 0, 0],
          [1, 1, 1, 1],
        ],
        depth: 4,
      },
    ];

    for (const { bits, want, depth } of cases) {
      it(`should prune ${JSON.stringify(bits)} at ${depth}`, () => {
        expect(getTree(prune(build(bits), depth))).toEqual(want);
      });
    }
  });
});
