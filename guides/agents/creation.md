# Creating Agents

## Configuration

When creating a `TinyAgent` instance you only need to supply an `options` parameter to the constructor.

The provider is the only required field.

```typescript
interface TinyAgentOptions<T extends TinyProvider<any, any, any>> {
  provider: T;
}
```

The remaining optional fields are:

```typescript
interface TinyAgentOptions<T extends TinyProvider<any, any, any>> {
  tools?: TinyTool[] | Record<string, TinyTool>;
  clients?: TinyMCP[];
  name?: string;
  settings?: AgentSettings;
}

interface AgentSettings {
  system?: string;
  maxSteps?: number;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}
```

## Creating an Agent

You will need an `API_KEY` from one of the supported providers.

1. You create a provider instances

```typescript
const provider = new TinyXAI({
  apiKey: "API_KEY",
});
```

2. You create a new `TinyAgent` and supply the provider

```typescript
const agent = new TinyAgent({
  provider,
});
```
