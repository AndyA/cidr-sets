import * as bt from "./bit-tree";

const getTree = (tree: bt.BitNode) =>
  [...bt.iterate(tree)].map(({ bits }) => bits);

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
        expect(bt.build(bits)).toEqual(want);
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
        expect(getTree(bt.build(bits))).toEqual(want);
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
        expect(getTree(bt.truncate(bt.build(bits), depth))).toEqual(want);
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
        expect(getTree(bt.prune(bt.build(bits), depth))).toEqual(want);
      });
    }
  });

  describe("complement", () => {
    const cases = [{ bits: [] }, { bits: [[]] }, { bits: [[1, 1, 1]] }];
    for (const { bits } of cases) {
      const tree = bt.build(bits);
      const comp = bt.complement(tree);
      expect(comp).not.toEqual(tree);
      expect(bt.complement(comp)).toEqual(tree);
    }
  });

  describe("union", () => {
    const cases = [
      { a: [], b: [], want: [] },
      { a: [[1]], b: [[0]], want: [[]] },
      { a: [[0]], b: [[0]], want: [[0]] },
      { a: [[0, 0]], b: [[0, 1]], want: [[0]] },
      {
        a: [[0, 0]],
        b: [[1, 1]],
        want: [
          [0, 0],
          [1, 1],
        ],
      },
      { a: undefined, b: [[1]], want: [[1]] },
      { a: [[1]], b: undefined, want: [[1]] },
    ];
    for (const { a, b, want } of cases)
      expect(getTree(bt.union(bt.build(a), bt.build(b)))).toEqual(
        getTree(bt.build(want))
      );
  });

  describe("intersection", () => {
    const cases = [
      { a: [], b: [], want: [] },
      { a: [[1, 1, 0]], b: [[1, 1, 1]], want: [] },
      { a: [[1, 1, 1, 1]], b: [[1, 1, 1]], want: [[1, 1, 1, 1]] },
    ];
    for (const { a, b, want } of cases)
      expect(getTree(bt.intersection(bt.build(a), bt.build(b)))).toEqual(
        getTree(bt.build(want))
      );
  });

  describe("negative", () => {
    expect(() => bt.build([[2]])).toThrow(/bad/i);
  });
});
