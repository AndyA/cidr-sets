import _ from "lodash";
import printf from "printf";
import * as bt from "../lib/bit-tree.js";

import { BitsTo, ToBits, bitsToIp4, ip4ToBits } from "../lib/ip4.js";

const bitsToCidr =
  (toAddr: BitsTo): BitsTo =>
  bits =>
    `${toAddr(bits)}/${bits.length}`;

const cidrToBits =
  (fromAddr: ToBits): ToBits =>
  addr => {
    const m = addr.match(/^(.+)\/(.+)$/);
    if (!m) return fromAddr(addr);
    const bits = fromAddr(m[1]);
    const mask = Number(m[2]);
    if (!m[2].length || isNaN(mask) || mask < 0 || mask > bits.length)
      throw new Error(`Bad mask: ${mask}`);
    return bits.slice(0, mask);
  };

const showTree = (node: bt.BitNode): void => {
  for (const { bits, count } of bt.iterate(node))
    console.log(printf("%5d %s", count, bitsToCidr(bitsToIp4)(bits)));
};

const ip = [
  "192.168.1.128",
  "192.168.0.0/24",
  "127.0.0.1",
  "192.168.0.0/16",
  "10.0.0.0/8",
  // "0.0.0.0/0",
];

const tree = bt.build(ip.map(cidrToBits(ip4ToBits)));

showTree(tree);
