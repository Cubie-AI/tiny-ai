import { z } from "zod";
import { TinyTool } from "../../src/tools/tools";
import { BuildToolParams } from "../../src/tools/tools.types";

describe("TinyTool", () => {
  const mockConfig: BuildToolParams = {
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

  it("should initialize correctly with valid BuildToolParams", () => {
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
});
