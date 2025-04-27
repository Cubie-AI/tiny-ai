import { ImageModelV1, ProviderV1 } from "@ai-sdk/provider";
import { LanguageModelV1 } from "ai";
import { getModelId, TinyProviderError } from "../utils";

/**
 * Base class for all providers.
 * This class is used to create a provider instance.
 * It is not meant to be used directly. Each provider should extend this class and implement the methods.
 */
export abstract class TinyProvider<
  ModelProvider extends ProviderV1,
  ModelProviderSettings,
  ModelProviderId extends string = ""
> {
  public provider: ModelProvider | undefined;
  constructor(public options: ModelProviderSettings) {}

  /**
   * Returns a LanguageModelV1 instance for the given provider using the specified model ID or the provider's default model ID.
   */
  languageModel(model?: ModelProviderId): LanguageModelV1 {
    if (!this.provider || !this.provider.languageModel) {
      throw new TinyProviderError("Provider does not support language models");
    }
    const modelId = getModelId(model, this.defaultLanguageModelId());
    return this.provider.languageModel(modelId);
  }

  /**
   * Returns an ImageModelV1 instance for the given provider using the specified model ID or the provider's default model ID.
   */
  imageModel(model: ModelProviderId): ImageModelV1 {
    if (!this.provider || !this.provider.imageModel) {
      throw new TinyProviderError("Provider does not support image models");
    }
    const modelId = getModelId(model, this.defaultImageModelId());
    return this.provider.imageModel(modelId);
  }

  /**
   * Returns the default model ID for the provider.
   * This is used to create a LanguageModelV1 instance when no modelId is provided.
   */
  defaultLanguageModelId(): ModelProviderId {
    throw new TinyProviderError("Provider does not support language models");
  }

  /**
   * Returns the default model ID for the provider.
   * This is used to create an ImageModelV1 instance when no modelId is provided.
   */
  defaultImageModelId(): ModelProviderId {
    throw new TinyProviderError("Provider does not support image models");
  }
}
