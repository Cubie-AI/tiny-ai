import { toMap } from "../../src/utils/transform";

describe("Transform Utilities", () => {
  it("should convert an array to a map using a key function", () => {
    const array = [1, 2, 3];
    const keyFn = (value: number) => `key-${value}`;
    const result = toMap(array, keyFn);
    expect(result).toEqual({
      "key-1": 1,
      "key-2": 2,
      "key-3": 3,
    });
  });

  it("should return an empty map if the array is empty", () => {
    const array: number[] = [];
    const keyFn = (value: number) => `key-${value}`;
    expect(toMap(array, keyFn)).toEqual({});
  });

  it("should convert a POJO to a map using a key function", () => {
    const pojo = { a: 1, b: 2, c: 3 };
    const keyFn = (value: number) => `key-${value}`;
    const result = toMap(pojo, keyFn);
    expect(result).toEqual({
      "key-1": 1,
      "key-2": 2,
      "key-3": 3,
    });
  });
});
