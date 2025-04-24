import { Tool } from "ai";
import { Result } from "../util";

/**
 * Parameters used to build a tool.
 */
export interface BuildToolParams {
  /** The description of the tool */
  description: string;
  /** Optional paramters that are passed into the tools handler during invokation. Note: Client side tools don't specify handlers */
  parameters?: Tool["parameters"];
  /** The function that will be called when the tool is executed */
  handler?: (args: any) => Promise<any>;
  /** Optional context that will be passed to the handler */
  context?: any;
}

export type ExecuteResult<Method extends (...args: any) => Promise<any>> =
  Result<ReturnType<Method>>;
