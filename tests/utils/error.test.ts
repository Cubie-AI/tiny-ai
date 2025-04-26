import { getErrorMessage } from "../../src/utils/error";

const message = "Test error message";
describe("getErrorMessage", () => {
  it("should return the message from an Error object", () => {
    const error = new Error(message);
    const result = getErrorMessage(error);
    expect(result).toBe(message);
  });

  it("should return the string if a string is passed", () => {
    const result = getErrorMessage(message);
    expect(result).toBe(message);
  });

  it("should return 'Unknown error' if the input is neither an Error nor a string", () => {
    const error = { unexpected: "object" };
    const result = getErrorMessage(error);
    expect(result).toBe("Unknown error occurred");
  });
});
