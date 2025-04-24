import { CoreMessage } from "ai";
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

/** Parameters for generating text using the agent. */
export interface GenerateTextParams {
  /** The prompt to generate text from. */
  prompt?: string;
  /** The messages to include in the generation. */
  messages?: CoreMessage[];
  /** The maximum number of steps to take during generation. This overrides the value supplied to TinyAgent during instantiation */
  maxSteps?: number;
  /** The model ID to use for generation. */
  modelId?: string;
}
