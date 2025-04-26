# Agents

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
