import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

/**
 * Settings for a Model Context Protocol (MCP) client.
 */
export interface MCPClientSettings {
  /** The name of the client */
  name: string;

  /** The version of the client */
  version: string;

  /** The transport type for the client */
  transport:
    | StdioClientTransport
    | SSEClientTransport
    | StreamableHTTPClientTransport;
}

export interface MCPToolSpec {
  /** The name of the tool */
  name: string;
  /** The description of the tool */
  description?: string;

  /** The parameters for the tool */
  inputSchema: unknown;

  /** The handler function for the tool */
  handler: (...args: any) => any;
}
