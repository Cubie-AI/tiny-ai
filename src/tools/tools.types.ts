import { Schema } from "ai";
import z from "zod";
import { Result } from "../utils";

/**
 * Parameters used to build a tool.
 */
export interface TinyToolConfig<T extends Record<string, any> = {}> {
  /** The description of the tool */
  description: string;
  /** Optional parameters that are passed into the tools handler during invocation. Note: Client side tools don't specify handlers */
  parameters?: z.ZodTypeAny | Schema;
  /** The function that will be called when the tool is executed */
  handler?: (...args: any) => any;
  /** Optional context that will be passed to the handler */
  context?: T;
}

/**
 * A utility type that maps an async function to a standard {@link Result} storing the awaited `ReturnType` in the data field.
 */
export type ExecuteResult<Method extends (...args: any) => PromiseLike<any>> =
  Result<Awaited<ReturnType<Method>>>;
