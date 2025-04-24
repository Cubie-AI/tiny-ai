import { CoreMessage } from "ai";
import { TinyProvider } from "../providers";

export interface TinyAgentOptions<T extends TinyProvider<any, any, any>> {
  name: string;
  provider: T;

  system?: string;
  maxSteps?: number;
}

export interface GenerateTextParams {
  prompt: string;
  messages?: CoreMessage[];
  maxSteps?: number;
  modelId?: string;
}
