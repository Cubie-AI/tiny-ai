import { TinyAnthropic, TinyTool } from "../../src";
import { TinyAgent } from "../../src/agent/agent";

const provider = new TinyAnthropic({
  apiKey: "test-api-key",
});

const tool = new TinyTool("testTool", {
  description: "testTool",
  parameters: {
    param: "string",
  },
});

describe("TinyAgent", () => {
  it("should create an agent instance", () => {
    const agent = new TinyAgent({
      provider,
    });
    expect(agent).toBeDefined();
    expect(agent.name).toBe("TinyAgent");
    expect(agent.provider).toBeDefined();
  });

  it("should create an agent instance with a custom name", () => {
    const agent = new TinyAgent({
      name: "testAgent",
      provider,
    });
    expect(agent).toBeDefined();
    expect(agent.name).toBe("testAgent");
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

describe("TinyAgent tools", () => {
  it("should get a tool by name", () => {
    const agent = new TinyAgent({
      provider,
      tools: [tool],
      settings: {},
    });
    console.log(agent.tools);
    const retrievedTool = agent.getTool(tool.name);
    expect(retrievedTool).toBeDefined();
    expect(retrievedTool).toEqual(tool);
  });

  it("should register a tool", () => {
    const agent = new TinyAgent({
      name: "testAgent",
      provider,
    });
    agent.putTool(tool);
    expect(agent.tools).toBeDefined();
    expect(agent.tools).toHaveProperty("testTool");
    expect(agent.getTool(tool.name)).toEqual(tool);
  });

  it("should unregister a tool", () => {
    const agent = new TinyAgent({
      name: "testAgent",
      provider,
      tools: [tool],
    });
    agent.deleteTool(tool.name);
    expect(agent.tools).not.toContain(tool);
    expect(agent.getTool(tool.name)).toBeUndefined();
  });
});
