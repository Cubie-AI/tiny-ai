import { CoreMessage, generateText, ToolSet } from "ai";
import { TinyProvider } from "../providers";
import { buildTool, BuildToolParams } from "../tools";
import { TinyAgentError } from "../util/error";
import { GenerateTextParams, TinyAgentOptions } from "./agent.types";

export class TinyAgent {
  tools: ToolSet;
  provider: TinyProvider<any, any, any>;
  system: string | undefined;
  maxSteps: number | undefined;

  constructor(options: TinyAgentOptions<TinyProvider<any, any, any>>) {
    this.provider = options.provider;
    this.system = options.system || "";
    this.maxSteps = options.maxSteps || 3;
    this.tools = {};
  }

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
      const messages = this.getMessages({ prompt, messages: userMessages });
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

  registerTool(name: string, toolInfo: BuildToolParams) {
    this.tools[name] = buildTool(toolInfo);
  }

  getMessages({ prompt, messages }: GenerateTextParams) {
    let result: CoreMessage[] = [];
    if (prompt) {
      result.push({ role: "user", content: prompt });
    } else if (messages) {
      result = messages;
    } else {
      throw new TinyAgentError("Prompt or messages are required");
    }
    return result;
  }
}
