import { TinyAnthropic } from "../../src";
import { TinyAgent } from "../../src/agent/agent";

describe("TinyAgent", () => {
  it("should create an agent instance", () => {
    const agent = new TinyAgent({
      name: "testAgent",
      provider: new TinyAnthropic({ apiKey: "test-api-key" }),
    });
    expect(agent).toBeDefined();
    expect(agent.name).toBe("testAgent");
    expect(agent.provider).toBeDefined();
  });
});

describe("TinyAgent settings", () => {
  it("should use default settings when no settings are provided", () => {
    const agent = new TinyAgent({
      name: "testAgent",
      provider: new TinyAnthropic({ apiKey: "test-api-key" }),
    });
    expect(agent.settings).toEqual(agent.defaultSettings());
  });

  it("should overwrite default settings when settings are provided", () => {
    const customSettings = { system: "Custom system prompt" };
    const agent = new TinyAgent({
      name: "testAgent",
      provider: new TinyAnthropic({ apiKey: "test-api-key" }),
      settings: customSettings,
    });
    expect(agent.settings).toEqual(customSettings);
  });

  it("should use an empty object when settings are explicitly set to an empty object", () => {
    const agent = new TinyAgent({
      name: "testAgent",
      provider: new TinyAnthropic({ apiKey: "test-api-key" }),
      settings: {},
    });
    expect(agent.settings).toEqual({});
  });
});
