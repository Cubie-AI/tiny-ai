import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { TinyTool } from "../tools";
import { err, ok, Result, TinyMCPError } from "../utils";
import { MCPClientSettings } from "./mcp.types";

/**
 * TinyMCP creates an interface between TinyAgent and the Model Context Protocol (MCP) SDK.
 */
export class TinyMCP {
  /** The MCP client instance */
  client: Client;

  /** Whether the client is connected */
  connected: boolean = false;

  /** The tools available to the client */
  toolMap: Record<string, TinyTool> = {};

  /** The resources available to the client */
  resourceMap: Record<string, TinyTool> = {};

  /** The prompts available to the client */
  promptMap: Record<string, string> = {};

  constructor(public settings: MCPClientSettings) {
    this.client = new Client({
      name: settings.name,
      version: settings.version,
      transport: settings.transport,
    });
  }

  /**
   * Attach the MCP Client instance to the transport.
   * Does nothing if the client is already connected.
   */
  async connect() {
    if (this.connected) {
      return;
    }
    try {
      await this.client.connect(this.settings.transport);
      this.connected = true;
    } catch (error) {
      console.error("Error connecting to MCP client:", error);
      this.connected = false;
    }
  }

  /**
   * Fetches the tools from the MCP client and converts them to TinyTool instances.
   */
  async tools() {
    let result: Result<Record<string, TinyTool>> = ok({});
    try {
      await this.connect();

      // Fetch tools from the MCP client
      // and convert them to TinyTool instances
      const remoteTools = await this.client.listTools();
      if (!remoteTools) {
        throw new TinyMCPError("No tools found");
      }

      // Construct TinyTool instances from the MCP tools
      // and add them to the toolMap
      for (const tool of remoteTools.tools) {
        this.toolMap[tool.name] = TinyTool.fromMCP({
          ...tool,
          handler: async (args) => {
            return await this.executeTool(tool.name, args);
          },
        });
      }

      result = ok(this.toolMap);
    } catch (error) {
      result = err(error);
    } finally {
      return result;
    }
  }

  /**
   * Executes a tool by name and parameters.
   * This method will connect to the MCP client,
   * call the tool, and then disconnect.
   */
  private async executeTool(name: string, parameters: any) {
    let result: Result<any> = ok(undefined);
    try {
      await this.connect();

      const response = await this.client.callTool({
        name,
        arguments: parameters || {},
      });

      if (!response) {
        throw new TinyMCPError("No response from tool");
      }

      result = ok(response);
    } catch (error) {
      result = err(error);
    } finally {
      return result;
    }
  }

  /**
   * Disconnects the MCP client.
   */
  async disconnect() {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }
}
