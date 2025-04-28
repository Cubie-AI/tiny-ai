import { generateText, streamText } from "ai";
import { TinyMCP } from "../mcp/mcp";
import { ProviderModelId, TinyProvider } from "../providers";
import { TinyTool } from "../tools";
import { buildTools } from "../tools/util";
import { err, getMessages, ok, TinyAgentError } from "../utils";
import { toMap } from "../utils/transform";
import {
  AgentSettings,
  GenerateStreamParams,
  GenerateTextParams,
  TinyAgentOptions,
} from "./agent.types";

/**
 * @document ../../guides/agents/creation.md
 */
export class TinyAgent<Provider extends TinyProvider<any, any, any>> {
  /** The name of the agent. */
  name: string;

  /** The provider */
  provider: Provider;

  /** The tools available to the agent. */
  toolMap: Record<string, TinyTool>;

  /** MCP Clients the agent is connected to */
  clients: Record<string, TinyMCP> = {};

  /** The system prompt for the agent.
   * Uses the default settings returned by {@link defaultSettings} if not provided.
   */
  settings: AgentSettings = this.defaultSettings();

  /**
   * Creates an instance of TinyAgent.
   */
  constructor(options: TinyAgentOptions<Provider>) {
    const {
      name = "TinyAgent",
      provider,
      tools = [],
      settings = undefined,
      clients = [],
    } = options;

    this.name = name;
    this.provider = provider;
    this.toolMap = toMap(tools, (tool) => tool.name);

    this.clients = toMap(clients, (client) => client.settings.name);

    // If agent settings are provided we override the default settings entirely
    if (settings) {
      this.settings = settings;
    }
  }

  /** Call the Provider's language model to generate a text response from the supplied prompt or messages.*/
  async generateText(
    params: GenerateTextParams<ProviderModelId<typeof this.provider>>
  ) {
    // Destructure the parameters that are used within the function
    const {
      modelId,
      prompt,
      messages,
      tools: paramTools = [],
      ...options
    } = params;

    const model = this.provider.languageModel(modelId);

    // Merge the existing class tools with the parameters
    // and build the tool set.
    const tools = await this.tools(paramTools);

    // merge the parameters with the class properties overriding any duplicates
    const config = {
      ...this.settings,
      ...options,
      model,
      tools,
      messages: getMessages({ prompt, messages }),
    };

    let result;
    try {
      const data = await generateText(config);
      if (!data) {
        throw new TinyAgentError("No data returned from the language model");
      }
      result = ok(data);
    } catch (error) {
      result = err(error);
    }
    return result;
  }

  async streamText(
    params: GenerateStreamParams<ProviderModelId<typeof this.provider>>
  ) {
    // Destructure the parameters that are used within the function
    const {
      modelId,
      prompt,
      messages,
      tools: paramTools = [],
      ...options
    } = params;

    const model = this.provider.languageModel(modelId);

    // Merge the existing class tools with the parameters
    // and build the tool set.
    const tools = await this.tools(paramTools);

    // merge the parameters with the class properties overriding any duplicates
    const config = {
      ...this.settings,
      ...options,
      model,
      tools,
      messages: getMessages({ prompt, messages }),
    };

    let result;
    try {
      const data = streamText(config);
      if (!data) {
        throw new TinyAgentError("No data returned from the language model");
      }
      result = ok(data);
    } catch (error) {
      result = err(error);
    }
    return result;
  }

  /** Adds or replaces a tool in the agent's tools. */
  putTool(tool: TinyTool) {
    if (!tool) {
      this.toolMap = {};
    }
    this.toolMap[tool.name] = tool;
  }

  /** Removes a tool from the agent */
  deleteTool(name: string) {
    if (name in this.toolMap) {
      delete this.toolMap[name];
    }
  }

  /** Returns a tool by name */
  async findTool(name: string) {
    const tools = await this.tools();
    return tools[name];
  }

  /** This will compile all agent tool sources into a single map.
   * It will use all class tools, all mcp client tools, and any extra tools
   * passed in as an argument to the function.
   */
  async tools(extraTools: TinyTool[] = []) {
    let clientTools = {
      ...this.toolMap,
    };
    for (const client of Object.values(this.clients)) {
      const tools = await client.tools();
      if (tools.success) {
        clientTools = { ...clientTools, ...tools.data };
      }
    }

    return buildTools({
      ...clientTools,
      ...toMap(extraTools),
    });
  }

  async connectClients() {
    for (const [name, client] of Object.entries(this.clients)) {
      if (!client.connected) {
        await client.connect();
      }
    }
  }

  async listClientTools() {}

  defaultSettings(): AgentSettings {
    return {
      system: "You are a helpful assistant.",
      maxSteps: 3,
      maxTokens: 1024,
      temperature: 0.7,
    };
  }
}
