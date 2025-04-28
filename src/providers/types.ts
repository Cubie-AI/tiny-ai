import { TinyProvider } from "./base";

export type ProviderModelId<Provider extends TinyProvider<any, any, any>> =
  Provider extends TinyProvider<any, any, infer ModelProviderId>
    ? ModelProviderId
    : never;
