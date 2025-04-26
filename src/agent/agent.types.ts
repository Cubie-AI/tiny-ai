import { generateText } from "ai";
import { TinyProvider } from "../providers";
import { TinyTool } from "../tools";

export interface AgentSettings {
  /** The tools available to the agent. */
  tools?: Record<string, TinyTool>;

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
  /** The name of the agent. */
  name: string;

  /** The provider instance for the agent. */
  provider: T;

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

/** Parameters for generating text using the agent. */
export type GenerateTextParams = VercelGenerateTextParams & {
  tools: Record<string, TinyTool>;

  /** The model ID to use for generation. */
  modelId?: string;
};
