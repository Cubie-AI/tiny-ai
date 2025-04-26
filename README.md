# Tiny AI

A small, unopinionated and easily extensible ai framework

![Cubie](https://github.com/Cubie-AI/tiny-ai/blob/main/publicMedia.png?raw=true)

## Table of Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Creating a TinyAgent](#creating-a-tinyagent)
  - [Basic Example](#basic-example)
  - [Tool Use Example](#tool-use-agent)
- [Examples](https://github.com/Cubie-AI/tiny-ai-examples)
  - [Simple Agent](https://github.com/Cubie-AI/tiny-ai-examples#simple-agent)
  - [Conversational Agent](https://github.com/Cubie-AI/tiny-ai-examples#simple-agent-convo)
  - [ExpressJs Agent](https://github.com/Cubie-AI/tiny-ai-examples#express-agent)
  - [Tool Use Agent](https://github.com/Cubie-AI/tiny-ai-examples#agent-tool-use)
  - [MCP Tool Use Agent](https://github.com/Cubie-AI/tiny-ai-examples#mcp-tool-use)

## Documentation

Read the docs: [DOCUMENTATION](https://cubie-ai.github.io/tiny-ai/)

Checkout our collection examples: [EXAMPLES](https://github.com/Cubie-AI/tiny-ai-examples)

## Installation

`tiny-ai` can be added to your project through npm.

```
npm i @cubie-ai/tiny-ai
```

## Getting Started

### Creating a TinyAgent

Creating a `TinyAgent` is super simple and only requires a single `TinyProvider` to be supplied.

```typescript
const provider = new TinyAnthropic({ apikey: "your-api-key" });
const agent = new TinyAgent({ provider });
```

### Basic Example

The following code is like the `hello, world!` of he `tiny-ai` framework.

```typescript
import { TinyAgent, TinyAnthropic, TinyTool } from "@cubie-ai/tiny-ai";
import { z } from "zod";

async function main() {
  const agent = new TinyAgent({
    name: "Cubie",
    provider: new TinyAnthropic({
      apiKey: "your-api-key",
    }),
    tools: [
      new TinyTool("getWeather", {
        description: "Get the weather at a given location",
        parameters: z.object({ location: z.string() }),
        handler: ({ location }) => 100,
      }),
    ],
    settings: {
      system: "You are a helpful and charming assistant",
    },
  });

  const response = await agent.generateText({
    prompt: "Hello, how are you?",
    maxSteps: 3,
  });

  console.log(response.data?.text);
}

main();
```

### Tools

Tools can be provided in 3 ways:

1. Through the constructor
2. Calling `.putTool` on an agent instance
3. Calling `.generateText` and including a `tools` parameter

The first 2 methods will persist the tools in the agents class. The third way discards the tool after it is used.

```typescript
import z from "zod";
import { TinyAgent } from "./agent";
import { TinyAnthropic } from "./providers";
import { TinyTool } from "./tools";

const populationTool = new TinyTool("getPopulation", {
  description: "Get the population of any location",
  parameters: z.object({
    location: z.string(),
  }),
  handler: async (args) => {
    // call some external system
    return { population: 1000000 };
  },
});

// METHOD 1: in the constructor
const agent = new TinyAgent({
  provider: new TinyAnthropic({
    apiKey: "your-api-key",
  }),
  tools: [populationTool],
});

// Method 2: Calling agent.putTool
agent.putTool(populationTool);

// Method 3: Passing the tools into a agent.generateText call
const result = await agent.generateText({
  prompt: "What is the population of the US?",
  tools: [populationTool],
});
```
