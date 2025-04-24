import { generateText, ToolSet } from "ai";
import { TinyProvider } from "../providers";
import { buildTool, BuildToolParams } from "../tools";
import { getMessages } from "../util";
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
    this.tools = {};
  }

  /** Call the Provider's language model to generate a text response from the supplied prompt or messages.*/
  async generateText(params: GenerateTextParams) {
    const {
      prompt,
      messages: userMessages,
      maxSteps = this.maxSteps,
      modelId,
    } = params;
    let result;

    try {
      const model = this.provider.languageModel(modelId);
      const messages = getMessages({ prompt, messages: userMessages });
      const data = await generateText({
        model,
        messages,
        tools: this.tools,
        system: this.system,
        maxSteps,
      });
      result = {
        success: true,
        data: data,
      };
    } catch (error) {
      result = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return result;
  }

  /** Builds a raw tool and registers it with the agents tools */
  registerTool(name: string, toolInfo: BuildToolParams) {
    this.tools[name] = buildTool(toolInfo);
  }
}
