import { z } from "zod";
import { buildTool } from "../../src/tools/util";

describe("buildTool", () => {
  it("should call buildTool with the correct config when build is invoked", () => {
    // Mock implementation of buildTool
    const mockConfig = {
      description: "testTool",
      parameters: z.object({
        param: z.string(),
      }),
      handler: jest.fn(),
      context: {},
    };
    const result = buildTool(mockConfig);
    expect(result).toBeDefined();
    expect(result.description).toBe("testTool");
  });
});
