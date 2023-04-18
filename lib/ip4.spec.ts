import { bitsToIp4, ip4ToBits } from "./ip4";

const cases = [
  { ip4: "255.255.255.255", bits: "11111111111111111111111111111111" },
  { ip4: "0.0.0.0", bits: "00000000000000000000000000000000" },
  { ip4: "1.2.3.4", bits: "00000001000000100000001100000100" },
];

describe("ip4ToBits", () => {
  for (const { ip4, bits } of cases) {
    it(`should parse ${ip4}`, () => {
      expect(ip4ToBits(ip4)).toEqual(bits.split("").map(Number));
    });
  }

  const fails = [{ ip4: "1.2.3" }, { ip4: "1.2.3.256" }];
  for (const { ip4 } of fails) {
    it(`should fail ${ip4}`, () => {
      expect(() => ip4ToBits(ip4)).toThrow(/badly formed/i);
    });
  }
});

describe("bitsToIp4", () => {
  for (const { ip4, bits } of cases) {
    it(`should format ${ip4}`, () => {
      expect(bitsToIp4(bits.split("").map(Number))).toBe(ip4);
    });
  }

  it(`should handle short bit strings`, () => {
    expect(bitsToIp4([])).toBe("0.0.0.0");
  });

  it(`should fail bad bit lists`, () => {
    expect(() => bitsToIp4([2])).toThrow(/bad bit/i);
  });
});
