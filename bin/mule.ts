import * as bt from "../lib/bit-tree.js";

const tree = bt.build([
  [1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 1],
]);

const showTree = (tree: bt.BitNode) => {
  for (const { bits, count } of bt.iterate(tree)) {
    console.log(bits);
  }
};

console.log(`tree`);
showTree(tree);
const slim = bt.truncate(tree, 2);
console.log(`slim`);
showTree(slim);
