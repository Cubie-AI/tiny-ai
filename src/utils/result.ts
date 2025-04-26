import { getErrorMessage } from "./error";

/**
 * A standardized result object for the TinyAgent and tools.
 */
export interface Result<T = any> {
  /** Indicates if the operation was successful. */
  success: boolean;
  /** The data returned from the operation. */
  data: T | undefined;
  /** The error message if the operation failed. Success will be false whenever error is set */
  error: string | undefined;
}

/**
 * A default result object that can be used when no parameters are provided.
 * This ensures that the result object is always in a consistent state.
 */
export const DEFAULT_RESULT: Result = {
  success: false,
  data: undefined,
  error: undefined,
};

/**
 * Builds a standardized result object.
 * If no parameters are provided, it will return a DEFAULT_RESULT.
 */
export function buildResult<T>(
  params: Partial<Result<T>> = DEFAULT_RESULT
): Result<T> {
  return {
    ...DEFAULT_RESULT,
    ...params,
  };
}

export function err(error: unknown): Result {
  return buildResult({
    success: false,
    error: getErrorMessage(error),
  });
}

export function ok<T>(data?: T): Result<T> {
  return buildResult({
    success: true,
    data,
  });
}
