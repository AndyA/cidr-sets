import _ from "lodash";
import printf from "printf";
import * as bt from "../lib/bit-tree.js";

import { bitsToIp4, ip4ToBits } from "../lib/ip4.js";
import { BitsTo, ToBits } from "../lib/types.js";
import { bitsToCidr, cidrToBits } from "../lib/cidr.js";

const showTree =
  (toAddr: BitsTo) =>
  (node: bt.BitNode): void => {
    for (const { bits, count } of bt.iterate(node))
      console.log(printf("%5d %s", count, toAddr(bits)));
  };

const buildTree = (toBits: ToBits) => (addr: string[]) =>
  bt.build(addr.map(toBits));

const showV4Tree = showTree(bitsToCidr(bitsToIp4));
const buildV4Tree = buildTree(cidrToBits(ip4ToBits));

const network = buildV4Tree(["192.168.0.0/16", "10.65.0.0/16"]);

const ip = ["192.168.1.128", "4.4.4.4", "10.65.1.0/24"];

const addr = buildV4Tree(ip);

showV4Tree(bt.intersection(network, addr));
