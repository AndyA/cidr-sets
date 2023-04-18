import { BitsTo, ToBits } from "./types.js";

export const bitsToCidr =
  (toAddr: BitsTo): BitsTo =>
  bits =>
    `${toAddr(bits)}/${bits.length}`;

export const cidrToBits =
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
