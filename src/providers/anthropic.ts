import {
  AnthropicProvider,
  AnthropicProviderSettings,
  createAnthropic,
} from "@ai-sdk/anthropic";
import { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";
import { TinyProvider } from "./base";
import { ProviderOptions } from "./base.types";

export class TinyAnthropic extends TinyProvider<
  AnthropicProvider,
  AnthropicProviderSettings,
  AnthropicMessagesModelId
> {
  constructor(
    options: Omit<ProviderOptions<AnthropicProviderSettings>, "name">
  ) {
    super({
      ...options,
      name: "TinyAnthropic",
    });
    this.provider = createAnthropic(this.options);
  }

  defaultLanguageModelId(): AnthropicMessagesModelId {
    return "claude-3-5-haiku-latest";
  }

  // fix this
  defaultImageModelId() {
    return "claude-3-5-haiku-latest";
  }
}
