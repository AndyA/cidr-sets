import { BitNode, build, iterate, truncate } from "../lib/bit-tree.js";

const tree = build([
  [1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 1],
]);

const showTree = (tree: BitNode) => {
  for (const { bits, count } of iterate(tree)) {
    console.log(bits);
  }
};

console.log(`tree`);
showTree(tree);
const slim = truncate(tree, 2);
console.log(`slim`);
showTree(slim);
