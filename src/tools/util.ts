import { Tool, tool } from "ai";
import z from "zod";
import { err, ok } from "../utils";
import { toMap } from "../utils/transform";
import { TinyTool } from "./tools";
import { ExecuteResult, TinyToolParams } from "./tools.types";

/**
 * Utility function to for converting a map or array of {@link TinyTool} into a map
 * of {@link Tool} objects.
 */
export function buildTools(tools: TinyTool[] | Record<string, TinyTool>) {
  return toMap(
    tools,
    (tool) => tool.name,
    (tool) => tool.build()
  );
}

/** This function is used to help dynamically build tools for an agent,
 *  by wrapping the handler function in a {@link executeToolCall} to allow for
 *  error handling, result formatting, and optional context passing.
 */
export function buildTool(params: TinyToolParams): Tool {
  const { description, parameters = z.object({}), handler, context } = params;

  const toolParams = {
    description,
    parameters: parameters,
  };

  return handler
    ? tool({ ...toolParams, execute: buildToolExecutor(handler, context) })
    : tool(toolParams);
}

/**
 * A wrapper function that returns a function that is compatible with the ai-sdk.
 * This function accepts an optional context which is added as the last argument to the method.
 */
export function buildToolExecutor<
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
