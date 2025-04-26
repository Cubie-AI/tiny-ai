import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { TinyMCP } from "../../src";

const transport = new StdioClientTransport({
  args: ["test/mcp/mcp-server.js"],
  command: "node",
});

describe("TinyMCP", () => {
  it("should initialize correctly with valid options", async () => {
    const tinyMCP = new TinyMCP({
      name: "testMCP",
      version: "1.0",
      transport,
    });
    expect(tinyMCP).toBeDefined();
  });
});
