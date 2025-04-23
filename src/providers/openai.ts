import {
  createOpenAI,
  OpenAIProvider,
  OpenAIProviderSettings,
} from "@ai-sdk/openai";
import { OpenAIChatModelId, OpenAIImageModelId } from "@ai-sdk/openai/internal";
import { TinyProvider } from "./base";
import { ProviderOptions } from "./base.types";

export class TinyOpenAI extends TinyProvider<
  OpenAIProvider,
  OpenAIProviderSettings,
  OpenAIChatModelId | OpenAIImageModelId
> {
  constructor(options: ProviderOptions<OpenAIProviderSettings>) {
    super({
      ...options,
      name: "TinyOpenAI",
    });
    this.provider = createOpenAI(this.options);
  }

  defaultLanguageModelId(): OpenAIChatModelId {
    return "chatgpt-4o-latest";
  }

  defaultImageModelId(): OpenAIImageModelId {
    return "dall-e-3";
  }
}
