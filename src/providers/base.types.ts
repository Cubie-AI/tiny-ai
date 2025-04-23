export type TinyProviderOptions<T> = { name: string } & T;
export type ProviderOptions<T> = Omit<TinyProviderOptions<T>, "name">;
