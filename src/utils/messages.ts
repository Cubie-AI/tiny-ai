import { CoreMessage, Message } from "ai";
import { TinyError } from "./error";

/**
 * A generic message type that can be used to represent user and assistant messages.
 */
export type TinyMessage = CoreMessage[] | Omit<Message, "id">[];

/** Requires at least prompt or messages to be specified. */
export interface GetMessageParams {
  prompt?: string;
  messages?: TinyMessage;
}

/** Converts a prompt to a CoreMessage[] or returns the messages if prompt is not specified. */
export function getMessages({
  prompt,
  messages,
}: GetMessageParams): TinyMessage {
  if (!prompt && (!messages || messages.length === 0)) {
    throw new TinyError("Prompt or messages are required");
  }

  return prompt ? [{ role: "user", content: prompt }] : messages || [];
}
