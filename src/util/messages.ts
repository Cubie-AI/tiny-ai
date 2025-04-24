import { CoreMessage } from "ai";
import { TinyError } from "./error";

/** Requires at least prompt or messages to be specified. */
export interface GetMessageParams {
  prompt?: string;
  messages?: CoreMessage[];
}

/** Converts a prompt to a CoreMessage[] or returns the messages if prompt is not specified. */
export function getMessages({
  prompt,
  messages,
}: GetMessageParams): CoreMessage[] {
  if (!prompt && (!messages || messages.length === 0)) {
    throw new TinyError("Prompt or messages are required");
  }

  return prompt ? [{ role: "user", content: prompt }] : messages || [];
}
