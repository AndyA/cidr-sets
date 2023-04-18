import * as bt from "../lib/bit-tree.js";

const tree = bt.union(bt.build([[1, 1]]), bt.build([[1, 1, 0, 0, 1, 1]]));

const showTree = (tree: bt.BitNode) => {
  for (const { bits, count } of bt.iterate(tree)) {
    console.log(bits);
  }
};

console.log(`tree`);
showTree(tree);
const slim = bt.prune(tree, 30);
console.log(`slim`);
showTree(slim);
