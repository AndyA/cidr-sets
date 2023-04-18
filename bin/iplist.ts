import _ from "lodash";
import printf from "printf";
import {
  BitNode,
  insert,
  complement,
  prune,
  iterate,
} from "../lib/bit-tree.js";

import { bitsToIp4, ip4ToBits } from "../lib/ip4.js";

const ip = [
  "95.150.143.19",
  "95.144.197.181",
  "2.26.116.48",
  "95.144.197.168",
  "95.149.249.153",
  "95.146.221.169",
  "2.26.116.107",
  "95.147.197.202",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "95.147.74.158",
  "2.26.116.76",
  "95.146.221.163",
  "31.127.85.18",
  "2.28.233.109",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.230.165",
  "82.132.228.176",
  "82.132.228.176",
  "82.132.229.201",
  "82.132.229.201",
  "31.127.85.50",
  "82.132.236.168",
  "109.180.42.18",
  "95.149.249.224",
  "95.149.249.249",
  "95.149.249.249",
  "95.150.143.40",
  "95.150.143.40",
  "95.150.143.49",
  "95.146.221.246",
  "95.150.143.19",
  "95.150.143.15",
  "95.146.221.213",
  "95.144.197.148",
  "31.127.85.71",
  "95.144.197.225",
  "95.147.197.196",
  "95.147.197.196",
  "31.127.30.117",
  "2.28.233.98",
  "95.147.197.231",
  "95.147.197.134",
  "46.69.134.240",
  "46.69.134.128",
  "2.28.233.60",
  "2.28.233.19",
  "95.146.221.137",
  "95.149.249.133",
  "95.146.221.168",
  "95.145.182.220",
  "46.69.134.247",
  "95.150.143.57",
  "95.150.143.39",
  "109.180.42.61",
  "109.180.42.97",
  "95.149.249.178",
  "2.26.116.55",
  "95.146.221.144",
  "95.150.143.122",
  "95.150.143.115",
  "95.150.143.60",
  "95.144.157.107",
  "2.26.116.32",
  "95.149.249.187",
  "95.145.182.131",
  "95.146.41.81",
  "46.69.134.151",
  "2.25.90.151",
  "2.25.90.151",
  "95.149.249.178",
  "95.147.74.245",
  "95.144.197.223",
  "95.146.221.180",
  "95.150.143.25",
  "95.147.197.181",
  "95.147.197.141",
  "95.147.197.197",
  "95.147.197.132",
  "95.147.197.212",
  "95.149.249.216",
  "95.149.249.216",
  "95.146.221.160",
  "2.26.116.78",
  "95.150.143.52",
  "2.28.233.101",
  "95.147.180.172",
  "95.147.180.172",
  "95.147.74.217",
  "95.144.197.169",
  "95.147.180.214",
  "95.147.180.214",
  "95.147.74.187",
  "2.26.116.9",
  "2.26.116.9",
  "172.70.90.151",
  "172.71.178.145",
  "172.70.90.67",
  "172.71.242.179",
  "2.26.116.9",
  "95.147.180.222",
  "95.147.197.201",
  "95.150.143.30",
  "95.149.249.177",
  "2.26.116.1",
];

const bitsToCidr = (bits: number[]): string =>
  `${bitsToIp4(bits)}/${bits.length}`;

const showTree = (node: BitNode, maxDepth = 32): void => {
  const cidrs: { cidr: string; count: number }[] = [];

  const slim = prune(node, maxDepth);

  for (const { bits, count } of iterate(slim))
    cidrs.push({ cidr: bitsToCidr(bits), count });

  cidrs.sort((a, b) => b.count - a.count);

  for (const { cidr, count } of cidrs)
    console.log(printf("%5d %s", count, cidr));
};

const extra = [];

const tree = _(ip)
  .concat(extra)
  .uniq()
  .map(ip4ToBits)
  .reduce(insert, undefined);

const INVERT = false;
const TRIM = 12;

const slim = prune(tree, TRIM);

const transform = INVERT ? complement : x => x;

showTree(transform(slim), 32);
