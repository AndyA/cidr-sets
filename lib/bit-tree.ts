interface BitSpanNode {
  zero?: BitSpanNode;
  one?: BitSpanNode;
  count: number;
}

export type BitNode = BitSpanNode | undefined;

export const isBitNode = (thing: unknown): thing is BitNode =>
  thing === undefined ||
  (thing && typeof thing === "object" && "count" in thing);

const isLeaf = (node: BitNode): boolean => !(!node || node.zero || node.one);
const isFull = (node: BitNode): boolean => !!(node && node.zero && node.one);
const isRedundant = (node: BitNode): boolean =>
  node && isFull(node) && isLeaf(node.zero) && isLeaf(node.one);

const pruneNode = (node: BitNode): BitNode =>
  isRedundant(node) ? { count: node.count } : node;

const makeNode = (zero: BitNode, one: BitNode): BitNode => {
  if (zero && one) {
    const count = zero.count + one.count;
    return pruneNode({ zero, one, count });
  }

  if (zero) return { zero, count: zero.count };
  if (one) return { one, count: one.count };

  /* istanbul ignore next - never happens but logically correct */
  return { count: 0 };
};

const bitName = ["zero", "one"];

export const insert = (node: BitNode, bits: number[]): BitNode => {
  if (node && isLeaf(node)) return node;
  if (!bits.length) return { count: 1 };

  const next: BitNode = node
    ? { ...node, count: node.count + 1 }
    : { count: 1 };

  const [head, ...tail] = bits;
  const bit = bitName[head];
  if (!bit) throw new Error(`Bad bit: ${head}`);

  return pruneNode({ ...next, [bit]: insert(next[bit], tail) });
};

export function* iterate(
  node: BitNode,
  bits: number[] = []
): Generator<{ bits: number[]; count: number }> {
  if (!node) return;
  if (isLeaf(node)) yield { bits, count: node.count };
  yield* iterate(node.zero, [...bits, 0]);
  yield* iterate(node.one, [...bits, 1]);
}

export const build = (bitSets: number[][], node?: BitNode): BitNode =>
  (bitSets || []).reduce(insert, node);

const depthClip = (
  node: BitNode,
  maxDepth: number,
  cond = (node: BitNode) => true
): BitNode => {
  const walk = (node: BitNode, depth: number) => {
    if (!node || isLeaf(node)) return node;
    if (depth > maxDepth && cond(node)) return { count: node.count };
    return makeNode(walk(node.zero, depth + 1), walk(node.one, depth + 1));
  };

  return walk(node, 1);
};

export const prune = (node: BitNode, maxDepth: number): BitNode =>
  depthClip(node, maxDepth, isFull);

export const truncate = (node: BitNode, maxDepth: number): BitNode =>
  depthClip(node, maxDepth);

export const complement = (node: BitNode): BitNode => {
  if (!node) return { count: 1 };
  if (isLeaf(node)) return;
  return makeNode(complement(node.zero), complement(node.one));
};

export const union = (na: BitNode, nb: BitNode): BitNode => {
  if (!na) return nb;
  if (!nb) return na;

  if (isLeaf(na)) return na;
  if (isLeaf(nb)) return nb;

  return makeNode(union(na.zero, nb.zero), union(na.one, nb.one));
};

export const intersection = (na: BitNode, nb: BitNode): BitNode =>
  complement(union(complement(na), complement(nb)));
