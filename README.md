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
- [Running The Example](#running-tool-use-example)
  - [Instructions](#instructions)
  - [Output](#output)

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
import { TinyAgent } from "./agent";
import { TinyAnthropic } from "./providers/anthropic";

async function main() {
  const agent = new TinyAgent({
    name: "Cubie",
    provider: new TinyAnthropic({
      apiKey: "your-api-key",
    }),
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

### Tool Use Example

You are able to `'register'` tools for the agent to use. A more comprehensive example of creating an agent is as follows:

```typescript
import z from "zod";
import { TinyAgent } from "./agent";
import { TinyAnthropic } from "./providers";
import {TinyTool} from "./tools"

async function main() {
  const agent = new TinyAgent({
    provider: new TinyAnthropic({
      apiKey: "your-api-key",
    }),
    settings: {
      tools: {
        getWeather: {
          description: "Get the average weather in a country",
          parameters: z.object({
            location: z.string(),
          }),
          handler: async (args) => {
            console.log(
              `Agent called getWeather with args: ${JSON.stringify(args)}`
            );
            return { temperature: 100 };
          },
        },
      },
    },
  });

  const populationTool = new TinyTool('getPopulation',  {
    description: "Get the population of any location",
    parameters: z.object({
      location: z.string(),
    }),
    handler: async (args) => {
      // call some external system
      return { population: 1000000 };
    })

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
