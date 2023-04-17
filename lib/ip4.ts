const badAddress = (addr: string) =>
  new Error(`Badly formed ip4 address: ${addr}`);

export const ip4ToBits = (addr: string) => {
  const parts = addr.split(".");
  if (parts.length !== 4 || !parts.every(part => /^\d+$/.test(part)))
    throw badAddress(addr);
  const bytes = parts.map(Number);
  if (bytes.some(byte => byte > 255)) throw badAddress(addr);
  return bytes.flatMap(byte =>
    byte.toString(2).padStart(8, "0").split("").map(Number)
  );
};

export const bitsToIp4 = (bits: number[]) => {
  if (bits.length > 32 || bits.some(bit => bit < 0 || bit > 1))
    throw new Error(`Bad bit list`);
  return bits
    .join("")
    .padEnd(32, "0")
    .match(/.{8}/g)
    .map(n => parseInt(n, 2))
    .join(".");
};
