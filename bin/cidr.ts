import _ from "lodash";
import printf from "printf";
import * as bt from "../lib/bit-tree.js";

import { bitsToIp4, ip4ToBits } from "../lib/ip4.js";
import { BitsTo } from "../lib/types.js";
import { bitsToCidr, cidrToBits } from "../lib/cidr.js";

const showTree =
  (toAddr: BitsTo) =>
  (node: bt.BitNode): void => {
    for (const { bits, count } of bt.iterate(node))
      console.log(printf("%5d %s", count, bitsToCidr(toAddr)(bits)));
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

showTree(bitsToIp4)(tree);
