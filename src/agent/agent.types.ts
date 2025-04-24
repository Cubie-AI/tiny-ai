import { generateText } from "ai";
import { TinyProvider } from "../providers";

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

  /** The system prompt for the agent. */
  system?: string;

  /** The maximum number of chained calls the agent should do during tool execution */
  maxSteps?: number;
}

type VercelGenerateTextParams = Omit<
  Parameters<typeof generateText>[0],
  "model"
>;

/** Parameters for generating text using the agent. */
export interface GenerateTextParams extends VercelGenerateTextParams {
  /** The model ID to use for generation. */
  modelId?: string;
}
