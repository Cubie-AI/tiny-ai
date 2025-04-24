import { TinyError } from "./error";

/**
 * Returns the model ID for the given model ID or the default model ID.
 * If neither is provided, an error is thrown.
 */
export function getModelId(modelId?: string, defaultModelId?: string) {
  if (!modelId && !defaultModelId) {
    throw new TinyError("Model ID is required");
  }
  return (modelId || defaultModelId) as string;
}
