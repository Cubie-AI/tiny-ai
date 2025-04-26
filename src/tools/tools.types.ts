import { Tool } from "ai";
import { Result } from "../utils";

/**
 * Parameters used to build a tool.
 */
export interface BuildToolParams {
  /** The description of the tool */
  description: string;
  /** Optional paramters that are passed into the tools handler during invokation. Note: Client side tools don't specify handlers */
  parameters?: Tool["parameters"];
  /** The function that will be called when the tool is executed */
  handler?: (...args: any) => any;
  /** Optional context that will be passed to the handler */
  context?: any;
}

/**
 * A utility type that maps an async function to a standard {@link Result} storing the awaited `ReturnType` in the data field.
 */
export type ExecuteResult<Method extends (...args: any) => PromiseLike<any>> =
  Result<Awaited<ReturnType<Method>>>;
