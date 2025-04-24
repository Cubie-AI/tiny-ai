# Tiny AI

A small, unopinionated and easily extensible ai framework

![Cubie](/publicMedia.png)

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Basic Example](#basic-example)
  - [Tool Use Example](#tool-use-agent)
- [Running The Example](#running-tool-use-example)
  - [Instructions](#instructions)
  - [Output](#output)

## Installation

`tiny-ai` can be added to your project through npm.

```
npm i @cubie-ai/tiny-ai
```

## Getting Started

### Basic Example

To get started using tiny-ai you only need to create 2 objects:

1. The Provider (ie TinyAnthropic, TinyOpenAI)
2. The Agent

The following code is like the `hello, world!` of he `tiny-ai` framework.

```typescript
import { TinyAgent } from "./agent";
import { TinyAnthropic } from "./providers/anthropic";

async function main() {
  const agent = new TinyAgent({
    name: "TinyAgent",
    system: "A tiny agent",
    provider: new TinyAnthropic({
      apiKey: "ANTHROPIC_API_KEY",
    }),
  });

  const response = await agent.generateText({
    prompt: "Hello, how are you?",
    maxSteps: 3,
  });

  console.log(response.data?.text);
}

main();
```

### Tool Use Agent

You are able to `'register'` tools for the agent to use. A more comprehensive example of creating an agent is as follows:

```typescript
import z from "zod";
import { TinyAgent } from "./agent";
import { TinyAnthropic } from "./providers/anthropic";

async function main() {
  const agent = new TinyAgent({
    name: "TinyAgent",
    system: "A tiny agent",
    provider: new TinyAnthropic({
      apiKey: "ANTHROPIC_API_KEY",
    }),
  });

  agent.registerTool("getWeather", {
    description: "Get the average weather in a country",
    parameters: z.object({
      location: z.string(),
    }),
    handler: async (args) => {
      console.log(`Agent called getWeather with args: ${JSON.stringify(args)}`);
      return { temperature: 100 };
    },
  });

  agent.registerTool("getPopulation", {
    description: "Get the population of any location",
    parameters: z.object({
      location: z.string(),
    }),
    handler: async (args) => {
      // call some external system
      return { population: 1000000 };
    },
  });

  const response = await agent.generateText({
    prompt: "What is the weather in los angeles and population of china?",
    maxSteps: 3,
  });

  console.log(response.data?.text);
}

main();
```

## Running Tool Use Example

### Instructions

I've temporarily provided the tool use example: [HERE](/src/example.ts);
Along with scripts in the `package.json` to run it.

First make sure you have installed the required dependencies

```bash
npm i
```

Then you can use the following command to run it

```bash
npm run example
```

### Output

The example should produce output similar to what i've included below.
The first thing we see is the `log` statement produced by our `getWhether` tool.

Following that we see the agent processed the results from both the tool calls and then proceeded to summarize the data in its own words.

It also calls out the inconsistency in the result from the `getPopulation` tool which in this example, was called with `china` as the parameter and was hardcoded to return 1M.

```bash
Agent called getWeather with args: {"location":"Los Angeles"}
Based on the results:
- The weather in Los Angeles shows a temperature of 100 (presumably degrees Fahrenheit), which is quite hot.
- The population of China is reported as 1,000,000, though this seems to be a simplified or placeholder number and may not reflect the actual current population.

Please note that the population figure appears to be a rough estimate or placeholder, and the actual population of China is much higher (around 1.4 billion as of recent estimates).

Is there anything else I can help you with?
```
