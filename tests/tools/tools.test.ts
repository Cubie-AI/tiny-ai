import { jsonSchema } from "ai";
import { z } from "zod";
import { TinyTool } from "../../src/tools/tools";
import { TinyToolConfig } from "../../src/tools/tools.types";

describe("TinyTool", () => {
  const mockConfig: TinyToolConfig = {
    description: "testTool",
    parameters: z.object({
      param: z.string(),
    }),
    handler: ({ param }) => true,
  };

  let tinyTool: TinyTool;
  beforeEach(() => {
    tinyTool = new TinyTool("toolName", mockConfig);
  });

  it("should initialize correctly with valid TinyToolConfig", () => {
    expect(tinyTool.config).toBe(mockConfig);
  });

  it("should call return the correct result when build is invoked", () => {
    const tool = new TinyTool("toolName", {
      description: "testTool",
      parameters: z.object({
        param: z.string(),
      }),
      handler: ({ param }) => ({
        success: true,
        param,
      }),
    });
    const result = tool.build();
    expect(result).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.parameters).toBeDefined();
  });

  it("should build a tool when parameters are a json schema", () => {
    const tool = new TinyTool("toolName", {
      description: "testTool",
      parameters: jsonSchema({
        type: "object",
        properties: {
          testKey: {
            type: "string",
          },
        },
        required: ["testKey"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      }),
      handler: ({ testKey }) => ({
        success: true,
        testKey,
      }),
    });

    const result = tool.build();
    expect(result).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.parameters).toBeDefined();
  });
});
