import { getModelId, TinyError } from "../../src";

const modelId = "gpt-3.5-turbo";
describe("getModelId", () => {
  it("should return the model ID", () => {
    expect(getModelId(modelId)).toBe(modelId);
  });

  it("should return the default ID when no model ID is provided", () => {
    expect(getModelId(undefined, modelId)).toBe(modelId);
  });

  it("should throw an error when no model ID or default model ID is provided", () => {
    expect(() => getModelId()).toThrow(TinyError);
  });
  it("should throw an error model ID is undefined", () => {
    expect(() => getModelId(undefined)).toThrow(TinyError);
  });
});
