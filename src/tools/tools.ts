import { Tool, tool } from "ai";
import z from "zod";
import { err, ok } from "../util";
import { BuildToolParams, ExecuteResult } from "./tools.types";

/** This function is used to help dynamically build tools for an agent,
 *  by wrapping the handler function in a {@link executeToolCall} to allow for
 *  error handling, result formatting, and optional context passing.
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
  Method extends (args: Arguments, context?: Context) => PromiseLike<any>
>(method: Method, context?: Context) {
  return async (args: Arguments) => {
    let result: ExecuteResult<Method>;

    try {
      const data = await method(args, context);
      result = ok(data);
    } catch (error) {
      result = err(error);
    }

    return result;
  };
}
