import { TinyXAI } from "../../src/providers/xai";

describe("TinyXAI", () => {
  it("should initialize correctly with valid options", () => {
    const options = { apiKey: "test-api-key" };
    const provider = new TinyXAI(options);
    expect(provider).toBeDefined();
    expect(provider.options).toEqual(options);
  });

  it("should return the correct default language model ID", () => {
    const options = { apiKey: "test-api-key" };
    const provider = new TinyXAI(options);
    expect(provider.defaultLanguageModelId()).toBe("grok-3-latest");
  });
});
