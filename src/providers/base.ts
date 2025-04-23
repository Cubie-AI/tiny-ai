import { ImageModelV1, ProviderV1 } from "@ai-sdk/provider";
import { LanguageModelV1 } from "ai";
import { TinyProviderError } from "../util/error";
import { TinyProviderOptions } from "./base.types";

export abstract class TinyProvider<
  ModelProvider extends ProviderV1,
  ModelProviderSettings,
  ModelProviderId extends string = ""
> {
  public provider: ModelProvider | undefined = undefined;
  constructor(public options: TinyProviderOptions<ModelProviderSettings>) {}

  languageModel(model?: ModelProviderId): LanguageModelV1 {
    if (!this.provider || !this.provider.languageModel) {
      throw new TinyProviderError("Provider does not support language models");
    }
    return this.provider.languageModel(model || this.defaultLanguageModelId());
  }

  imageModel(model: ModelProviderId): ImageModelV1 {
    if (!this.provider || !this.provider.imageModel) {
      throw new TinyProviderError("Provider does not support image models");
    }
    return this.provider.imageModel(model || this.defaultImageModelId());
  }

  abstract defaultLanguageModelId(): ModelProviderId;
  abstract defaultImageModelId(): ModelProviderId;
}
