import { generateText, ToolSet } from "ai";
import { TinyProvider } from "../providers";
import { buildTool, BuildToolParams } from "../tools";
import { err, getMessages, ok, TinyAgentError } from "../util";
import { GenerateTextParams, TinyAgentOptions } from "./agent.types";

/**
 * Creates an agent that can interact with a language models, image models, and tools.
 */
export class TinyAgent {
  /** A map of tools available to the TinyAgent */
  tools: ToolSet;
  /** The provider */
  provider: TinyProvider<any, any, any>;
  /** The system prompt */
  system: string | undefined;
  /** The maximum number of chained calls the agent should do during tool execution */
  maxSteps: number | undefined;

  /**
   * Creates an instance of TinyAgent.
   */
  constructor(options: TinyAgentOptions<TinyProvider<any, any, any>>) {
    this.provider = options.provider;
    this.system = options.system || "";
    this.maxSteps = options.maxSteps || 3;
    this.tools = options.tools || {};
  }

  /** Call the Provider's language model to generate a text response from the supplied prompt or messages.*/
  async generateText(params: GenerateTextParams) {
    // Destructure the parameters that are used within the function
    const { modelId, prompt, messages, ...rest } = params;

    // merge the parameters with the class properties overriding any duplicates
    const config = {
      system: this.system,
      tools: this.tools,
      maxSteps: this.maxSteps,
      ...rest,
    };

    let result;
    try {
      const data = await generateText({
        model: this.provider.languageModel(modelId),
        ...config,
        messages: getMessages({ prompt, messages }),
      });

      if (!data) {
        throw new TinyAgentError("No data returned from the language model");
      }

      result = ok(data);
    } catch (error) {
      result = err(error);
    }

    return result;
  }

  /** Builds a tool and adds it to the agents tools. Replace's any existing tool with the same name */
  registerTool(name: string, toolInfo: BuildToolParams) {
    this.tools[name] = buildTool(toolInfo);
  }

  /** Removes a tool from the agent */
  unregisterTool(name: string) {
    if (this.tools[name]) {
      delete this.tools[name];
    }
  }
}
