import { generateText } from "ai";
import { TinyProvider } from "../providers";
import { TinyTool } from "../tools";
import { buildTools } from "../tools/util";
import { err, getMessages, ok, TinyAgentError } from "../utils";
import { toMap } from "../utils/transform";
import {
  AgentSettings,
  GenerateTextParams,
  TinyAgentOptions,
} from "./agent.types";

/**
 * Creates an agent that can interact with a language models, image models, and tools.
 */
export class TinyAgent {
  /** The name of the agent. */
  name: string;

  /** The provider */
  provider: TinyProvider<any, any, any>;

  /** The tools available to the agent. */
  tools: Record<string, TinyTool>;

  /** The system prompt for the agent.
   * Uses the default settings returned by {@link defaultSettings} if not provided.
   */
  settings: AgentSettings = this.defaultSettings();

  /**
   * Creates an instance of TinyAgent.
   */
  constructor(options: TinyAgentOptions<TinyProvider<any, any, any>>) {
    const {
      name = "TinyAgent",
      provider,
      tools = [],
      settings = undefined,
    } = options;

    this.name = name;
    this.provider = provider;
    this.tools = toMap(tools, (tool) => tool.name);

    // If agent settings are provided we override the default settings entirely
    if (settings) {
      this.settings = settings;
    }
  }

  /** Call the Provider's language model to generate a text response from the supplied prompt or messages.*/
  async generateText(params: GenerateTextParams) {
    // Destructure the parameters that are used within the function
    const {
      modelId,
      prompt,
      messages,
      tools: paramTools = [],
      ...options
    } = params;

    // Merge the existing class tools with the parameters
    // and build the tool set.
    const tools = buildTools({
      ...this.tools,
      ...toMap(paramTools),
    });

    // merge the parameters with the class properties overriding any duplicates
    const config = {
      ...this.settings,
      ...options,
      model: this.provider.languageModel(modelId),
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

  /** Adds or replaces a tool in the agent's tools. */
  putTool(tool: TinyTool) {
    if (!tool) {
      this.tools = {};
    }
    this.tools[tool.name] = tool;
  }

  /** Removes a tool from the agent */
  deleteTool(name: string) {
    if (name in this.tools) {
      delete this.tools[name];
    }
  }

  /** Returns a tool by name */
  getTool(name: string) {
    return this.tools[name] || undefined;
  }

  defaultSettings(): Required<AgentSettings> {
    return {
      system: "You are a helpful assistant.",
      maxSteps: 3,
      maxTokens: 1024,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    };
  }
}
