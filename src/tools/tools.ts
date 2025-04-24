import { Tool, tool } from "ai";
import z from "zod";
import { buildResult } from "../util";
import { BuildToolParams, ExecuteResult } from "./tools.types";

/** This function is used to help dynamically build tools for the agent.
 *  Specifically it wraps the handler function and binds the context to it.
 */
export function buildTool(params: BuildToolParams): Tool {
  const { description, parameters = z.object({}), handler, context } = params;

  const toolParams = {
    description,
    parameters: parameters,
  };

  return handler
    ? tool({ ...toolParams, execute: executeToolCall(handler, context) })
    : tool(toolParams);
}

/**
 * A wrapper function that returns a function that is compatible with the ai-sdk.
 * This function accepts an optional context which is added as the last argument to the method.
 */
export function executeToolCall<
  Arguments,
  Context,
  Method extends (args: Arguments, context?: Context) => Promise<any>
>(method: Method, context?: Context) {
  return async (args: Arguments) => {
    // Initialize a standard result object with default values
    // In any failure the vercel ai sdk requires tools to return results
    let result: ExecuteResult<Method> = buildResult();

    try {
      const data = await method(args, context);
      result = buildResult({ success: true, data });
    } catch (error) {
      result = buildResult({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }

    return result;
  };
}
