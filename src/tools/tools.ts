import { tool } from "ai";
import z from "zod";
import { TinyToolError } from "../util/error";
import { BuildToolParams } from "./tools.types";

async function defaultToolExecute(args: any) {
  throw new TinyToolError("No execute function provided");
}

export function buildTool(params: BuildToolParams) {
  const {
    description,
    parameters = z.object({}),
    handler = defaultToolExecute,
    context,
  } = params;

  return tool({
    description,
    parameters,
    execute: executeToolCall(handler, context),
  });
}

interface ToolCallResult<T> {
  success: boolean;
  data: T | undefined;
  error: string | undefined;
}

type ExecuteResult<Method extends (...args: any) => Promise<any>> =
  ToolCallResult<ReturnType<Method>>;
// This function returns a async function that takes a single parameters object but
// binds the method and context to the function
export function executeToolCall<
  Arguments,
  Context,
  Method extends (args: Arguments, context?: Context) => Promise<any>
>(method: Method, context?: Context) {
  return async (args: Arguments): Promise<ExecuteResult<Method>> => {
    // Initialize a standard result object with default values
    // In any failure the vercel ai sdk requires tools to return results
    let result: ExecuteResult<Method> = {
      success: false,
      data: undefined,
      error: "Unknown error",
    };

    try {
      const data = await method(args, context);
      result.success = true;
      result.data = data;
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
    }
    return result;
  };
}
