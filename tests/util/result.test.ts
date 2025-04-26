import { buildResult, DEFAULT_RESULT, err, ok } from "../../src/util/result";

describe("buildResult", () => {
  it("should return the DEFAULT_RESULT when no parameters are provided", () => {
    const result = buildResult();
    expect(result).toEqual(DEFAULT_RESULT);
  });

  it("should override DEFAULT_RESULT properties with provided parameters", () => {
    const result = buildResult({ success: true, data: "test" });
    expect(result).toEqual({
      success: true,
      data: "test",
      error: undefined,
    });
  });
});

describe("ok", () => {
  it("should return a success result with the provided data", () => {
    const data = { id: 1, name: "test" };
    const result = ok(data);
    expect(result).toEqual({
      success: true,
      data,
      error: undefined,
    });
  });
});

describe("err", () => {
  it("should return a failure result with the provided error message", () => {
    const errorMessage = "Something went wrong";
    const result = err(new Error(errorMessage));
    expect(result).toEqual({
      success: false,
      data: undefined,
      error: errorMessage,
    });
  });
});
