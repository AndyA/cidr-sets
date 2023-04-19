import { bitsToIp6, ip6ToBits } from "./ip6";

const my6ToBits = (addr: string): number[] => {
  const parts = addr.split(":");
  if (parts.length !== 8)
    throw new Error(`Only simple addresses supported: ${addr}`);

  return parts
    .map(word => parseInt(word, 16).toString(2).padStart(16, "0"))
    .join("")
    .split("")
    .map(Number);
};

const myBitsTo6 = (bits: number[]): string => {
  if (bits.length !== 128)
    throw new Error(`Wrong number of bits: ${bits.length}`);
  const list = [...bits];
  const parts = [];
  while (list.length) {
    const word = list.splice(0, 16);
    parts.push(parseInt(word.join(""), 2).toString(16));
  }
  return parts.join(":");
};

const basic = ["2001:db8:85a3:0:1:8a2e:370:7334", "1:2:3:4:5:6:7:8"];

describe("test support", () => {
  for (const addr of basic) {
    it(`should handle parse and format ${addr}`, () => {
      expect(myBitsTo6(my6ToBits(addr))).toBe(addr);
    });
  }
});

const cases = [
  {
    simple: "2001:db8:85a3:0:0:8a2e:370:7334",
    fancy: "2001:db8:85a3::8a2e:370:7334",
  },
  {
    simple: "fe80:0:0:0:2819:ecff:fe82:ef7c",
    fancy: "fe80::2819:ecff:fe82:ef7c",
  },
  { simple: "0:0:0:0:0:0:0:0", fancy: "::" },
  { simple: "0:0:0:0:0:0:0:1", fancy: "::1" },
  { simple: "1:0:0:0:0:0:0:0", fancy: "1::" },
  { simple: "1:0:0:0:0:0:0:1", fancy: "1::1" },
  { simple: "1:0:0:1:1:0:0:1", fancy: "1::1:1:0:0:1" },
  { simple: "1:0:0:1:0:0:0:1", fancy: "1:0:0:1::1" },
  { simple: "FFFF:0:0:1:0:0:0:1", fancy: "ffff:0:0:1::1" },
  { simple: "2001:db8:0:0:1:0:0:1", fancy: "2001:db8::1:0:0:1" },
  { simple: "2001:db8:0:0:0:0:2:1", fancy: "2001:db8::2:1" },
];

const ip4in6 = [
  { mapped: "::ffff:192.0.2.128", ip6: "::ffff:c000:280" },
  { mapped: "::4.4.4.4", ip6: "::404:404" },
];

const partial = [
  { bits: [1], want: "8000::" },
  { bits: [1, 1, 1, 1], want: "f000::" },
  { bits: [], want: "::" },
  { bits: [0, 0, 0, 0, 0, 0, 0], want: "::" },
];

describe("ip6ToBits / bitsToIp6", () => {
  for (const addr of basic) {
    it(`should parse and format ${addr}`, () => {
      expect(myBitsTo6(ip6ToBits(addr))).toBe(addr);
      expect(bitsToIp6(my6ToBits(addr))).toBe(addr);
      expect(bitsToIp6(ip6ToBits(addr))).toBe(addr);
    });
  }

  for (const { simple, fancy } of cases) {
    it(`should parse and format ${fancy}`, () => {
      expect(bitsToIp6(ip6ToBits(simple))).toBe(fancy);
      expect(bitsToIp6(ip6ToBits(fancy))).toBe(fancy);
    });
  }

  for (const { mapped, ip6 } of ip4in6) {
    it(`should parse ${mapped}`, () => {
      expect(bitsToIp6(ip6ToBits(mapped))).toBe(ip6);
    });
  }

  for (const { bits, want } of partial) {
    it(`should encode ${bits.join(", ")}`, () => {
      expect(bitsToIp6(bits)).toBe(want);
    });
  }
});

describe("negative", () => {
  it(`should fail on bad hex`, () => {
    expect(() => ip6ToBits("gggg::")).toThrow(/bad hex/i);
    expect(() => ip6ToBits("00000::")).toThrow(/bad hex/i);
    expect(() => ip6ToBits(":::")).toThrow(/bad hex/i);
  });

  it(`should fail if the address is the wrong length`, () => {
    expect(() => ip6ToBits("a:b")).toThrow(/parts/i);
  });

  it(`should fail on bad bits`, () => {
    expect(() => bitsToIp6([3])).toThrow(/bad bit/i);
  });

  it(`should fail on too many "::"`, () => {
    expect(() => ip6ToBits("::a::")).toThrow(/multiple/i);
  });

  it(`should fail on unnecessary "::"`, () => {
    expect(() => ip6ToBits("0:0:0:0::0:0:0")).toThrow(/unnecessary/i);
  });
});
