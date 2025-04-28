import { generateText, streamText } from "ai";
import { TinyMCP } from "../mcp/mcp";
import { TinyProvider } from "../providers";
import { TinyTool } from "../tools";

export interface AgentSettings {
  /** The system prompt for the agent. */
  system?: string;

  /** The maximum number of chained calls the agent should do during tool execution */
  maxSteps?: number;

  /** The maximum number of tokens to generate */
  maxTokens?: number;

  /** The temperature of the model */
  temperature?: number;

  /** The top_p of the model */
  topP?: number;

  /** The frequency penalty of the model */
  frequencyPenalty?: number;

  /** The presence penalty of the model */
  presencePenalty?: number;
}

/**
 * Options for configuring a TinyAgent instance.
 *
 * @template T - A generic type that extends TinyProvider.
 */
export interface TinyAgentOptions<T extends TinyProvider<any, any, any>> {
  /** The provider instance for the agent. */
  provider: T;

  /** The tools available to the agent. */
  tools?: TinyTool[] | Record<string, TinyTool>;

  /**
   * A list of TinyMCP clients available to the agent.
   */
  clients?: TinyMCP[];

  /** An optional name for the agent instance. Defaults to TinyAgent */
  name?: string;

  /** The settings for the agent.
   * These will override the default settings returned by {@link TinyAgent.defaultSettings}.
   * An empty object will result in no settings being applied.
   * Providing undefined or not providing settings will use the default settings.
   */
  settings?: AgentSettings;
}

/**
 * A utility type to extract the parameters from the `generateText` function.
 * This is useful for creating a type that matches the parameters used in the agent's text generation.
 */
export type VercelGenerateTextParams = Omit<
  Parameters<typeof generateText>[0],
  "model" | "tools"
>;

export type VercelStreamTextParams = Omit<
  Parameters<typeof streamText>[0],
  "model" | "tools"
>;

export type GenerateStreamParams<ModelProviderId extends string = string> =
  VercelStreamTextParams & {
    tools?: TinyTool[];
    /** The model ID to use for generation. */
    modelId?: ModelProviderId;
  };

/** Parameters for generating text using the agent. */
export interface GenerateTextParams<ModelProviderId extends string = string> {
  tools?: TinyTool[];

  /** The model ID to use for generation. */
  modelId?: ModelProviderId;

  /** Other parameters for text generation */
  [key: string]: any;
}
