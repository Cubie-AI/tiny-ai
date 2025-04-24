import { createXai, XaiProvider, XaiProviderSettings } from "@ai-sdk/xai";
import { TinyProvider } from "./base";
import { TinyProviderOptions } from "./base.types";

/** The support language models by xAI */
export type XaiChatModelId =
  | "grok-3"
  | "grok-3-latest"
  | "grok-3-fast"
  | "grok-3-fast-latest"
  | "grok-3-mini"
  | "grok-3-mini-latest"
  | "grok-3-mini-fast"
  | "grok-3-mini-fast-latest"
  | "grok-2-vision-1212"
  | "grok-2-vision"
  | "grok-2-vision-latest"
  | "grok-2-image-1212"
  | "grok-2-image"
  | "grok-2-image-latest"
  | "grok-2-1212"
  | "grok-2"
  | "grok-2-latest"
  | "grok-vision-beta"
  | "grok-beta"
  | (string & {});

/** The support image models by xAI */
export type XaiImageModelId = "grok-2-image" | (string & {});

export class TinyXAI extends TinyProvider<
  XaiProvider,
  XaiProviderSettings,
  XaiChatModelId | XaiImageModelId
> {
  constructor(options: TinyProviderOptions<XaiProviderSettings>) {
    super({
      ...options,
    });
    this.provider = createXai(this.options);
  }

  defaultLanguageModelId(): XaiChatModelId {
    return "grok-3-latest";
  }

  defaultImageModelId(): XaiImageModelId {
    return "grok-2-image";
  }
}
