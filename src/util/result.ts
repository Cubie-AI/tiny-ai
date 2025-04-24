/**
 * A standardized result object for the TinyAgent and tools.
 */
export interface Result<T> {
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
const DEFAULT_RESULT: Result<any> = {
  success: false,
  data: undefined,
  error: "Unknown error",
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
