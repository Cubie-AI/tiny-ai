import { TinyAnthropic } from "../../src/providers/anthropic";

describe("TinyAnthropic", () => {
  it("should initialize correctly with valid options", () => {
    const options = { apiKey: "test-api-key" };
    const provider = new TinyAnthropic(options);
    expect(provider).toBeDefined();
    expect(provider.options).toEqual(options);
  });

  it("should return the correct default language model ID", () => {
    const options = { apiKey: "test-api-key" };
    const provider = new TinyAnthropic(options);
    expect(provider.defaultLanguageModelId()).toBe("claude-3-5-haiku-latest");
  });
});
