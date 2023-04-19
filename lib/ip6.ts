import { ip4ToBits } from "./ip4";
import { ToBits, BitsTo } from "./types";

const parseRadix = (radix: number) => (n: string) => parseInt(n, radix);

const hexWords = (words: number[]) =>
  words.map(word => word.toString(16)).join(":");

const last = (nums: number[]): number => nums[nums.length - 1] || 0;

const parseParts = (part: string): number[] => {
  if (part === "") return [];
  const words = part.split(":");
  if (!words.every(word => /^[0-9a-f]{1,4}$/i.test(word)))
    throw new Error(`Bad hex in ${part}`);
  return words.map(parseRadix(16));
};

const zeros = (length: number): number[] =>
  Array.from({ length }).fill(0) as number[];

const v4suffix = (addr: string): string => {
  const m = addr.match(/^(.+):(\d+\.\d+\.\d+\.\d+)$/);
  if (!m) return addr;
  const words = hexWords(
    ip4ToBits(m[2]).join("").match(/.{16}/g).map(parseRadix(2))
  );
  return [m[1], words].join(":");
};

const padParts = (addr: string): number[] => {
  const segs = v4suffix(addr).split("::");
  if (segs.length > 2) throw new Error(`Illegal multiple "::" in ${addr}`);

  if (segs.length === 1) return parseParts(segs[0]);

  const [left, right] = segs.map(parseParts);

  const need = 8 - left.length - right.length;
  if (need < 2) throw new Error(`Illegal unnecessary "::" in ${addr}`);

  return [left, zeros(need), right].flat();
};

export const ip6ToBits: ToBits = addr => {
  const parts = padParts(addr);
  if (parts.length !== 8)
    throw new Error(`IPv6 addresses need 8 parts: ${addr}`);

  return parts
    .map(word => word.toString(2).padStart(16, "0"))
    .join("")
    .split("")
    .map(Number);
};

export const bitsToIp6: BitsTo = bits => {
  if (bits.length > 128 || bits.some(bit => bit < 0 || bit > 1))
    throw new Error(`Bad bit list`);

  const words = bits
    .join("")
    .padEnd(128, "0")
    .match(/.{16}/g)
    .map(parseRadix(2));

  // Track the length of runs. If word is 0 its run
  // length is the run length of its predecessor + 1.
  // If it's non-zero its run length is 0.
  const tally = (a: number[], b: number) => [...a, b === 0 ? last(a) + 1 : 0];

  // Find the longest run of zeros
  const [len, end] = words
    .reduce(tally, [])
    .map((len, i) => [len, i])
    .reduce((a, b) => (b[0] > a[0] ? b : a));

  if (len < 2) return hexWords(words);

  return [
    hexWords(words.slice(0, end - len + 1)),
    hexWords(words.slice(end + 1)),
  ].join("::");
};
