# Tiny AI

A small, unopinionated and easily extensible ai framework

![Cubie](https://github.com/Cubie-AI/tiny-ai/blob/main/publicMedia.png?raw=true)

## Table of Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Creating a TinyAgent](#creating-a-tinyagent)
  - [Basic Example](#basic-example)
  - [Tools](#tools)
  - [Social Agent (WIP)](#building-a-social-agent-wip)
- [Examples](https://github.com/Cubie-AI/tiny-ai-examples)
  - [Simple Agent](https://github.com/Cubie-AI/tiny-ai-examples#simple-agent)
  - [Conversational Agent](https://github.com/Cubie-AI/tiny-ai-examples#simple-agent-convo)
  - [ExpressJs Agent](https://github.com/Cubie-AI/tiny-ai-examples#express-agent)
  - [Tool Use Agent](https://github.com/Cubie-AI/tiny-ai-examples#agent-tool-use)
  - [MCP Tool Use Agent](https://github.com/Cubie-AI/tiny-ai-examples#mcp-tool-use-agent)

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
  // create the model provider
  const provider = new TinyAnthropic({
    apiKey: "your-api-key",
  });

  // create a simple tool
  const weather = new TinyTool("getWeather", {
    description: "Get the weather at a given location",
    parameters: z.object({ location: z.string() }),
    handler: ({ location }) => 100,
  });

  // create the agent
  const agent = new TinyAgent({
    provider,
    tools: [tool],
    settings: {
      // optional agent settings
      system: "You are a helpful and charming assistant",
    },
  });

  // use the agent to generateText
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

// Method 1: in the constructor
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

### MCP Clients

You may also wish to supply your agent with access to an MCP server.

```typescript
import { TinyAgent, TinyAnthropic, TinyMCP } from "@cubie-ai/tiny-ai";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

// Create a TinyMCP instances and pass in the name, version and transport
const solanaMcpClient = new TinyMCP({
  name: "Solana MCP Client",
  version: "1.0.0",
  transport: new StdioClientTransport({
    command: "node",
    args: ["dist/mcp/server.js"],
  }),
});

// Add one or more clients to your agent.
export const agent = new TinyAgent({
  settings: {
    system: "You are a helpful assistant.",
    maxSteps: 5,
  },
  provider: new TinyAnthropic({
    apiKey: "your-api-key",
  }),
  clients: [solanaMcpClient],
});
```

## Building a social agent (WIP)

This is just an example and none of the twitter functionality is actually complete here.
I will create a seprate registry tools.

```typescript
import { TinyAgent, TinyAnthropic, TinyTool } from "@cubie-ai/tiny-ai";
import { input } from "@inquirer/prompts";
import "dotenv/config";
import z from "zod";

// Prep the tiny agent
const anthropic = new TinyAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const agent = new TinyAgent({
  provider: anthropic,
  settings: {
    maxSteps: 5 //required for the agent to chain tool calls and inference
  }
});

// create a loading function that gets all information relevant for to the agent
function mockLoadContext() {
  return {
    Name: "Cubie",
    Age: 5,
    Location: "Solana",
    Interests: ["AI", "Blockchain", "Web3"],
    FavoriteColor: "Blue",
    FavoriteFood: "Pizza",
    mentions: [
      { from: "user1", text: "Hello, how are you?" },
      { from: "user2", text: "What is your favorite color?" },
      { from: "user3", text: "Do you like pizza?" },
    ],
    recentTweets: [
      { text: "Just had a great pizza!", date: "2023-10-01" },
      { text: "Loving the new AI features!", date: "2023-10-02" },
      { text: "Blockchain is the future!", date: "2023-10-03" },
    ],
  };
}

const loadContext = new TinyTool("loadContext", {
  description:
    "Load the context before writing a tweet. Must be called before calling 'tweet'. Return the context as a string.",
  handler: () => ({ context: formatContext(mockLoadContext()) }),
});

// create a tool that posts tweets. Here you would use the twitter-sdk
const tweet = new TinyTool("tweet", {
  description: "Post a tweet to Twitter. ",
  parameters: z.object({
    context: z.string();
  }),
  handler: async ({context}) => {
    const generateTweet = agent.generateText({
      prompt: `${context}
      # Task
      Your task is to generate compelling tweets based on all the information above`,
      maxSteps: 5,
      temperature: 0.7,
    });
  },
});

// Add the tool to the agent
agent.putTool(tweet);

async function main() {
  // Here if you ask the agent to write a tweet it will call the tweet tool
  const userMessage = await input({
    message: "You: ",
    validate: (input) => {
      return input.trim() !== "" ? true : "Please enter a message.";
    },
  });

  const response = await agent.generateText({
    prompt: userMessage,
  });

  // Check if the response is valid
  if (!response || !response.success) {
    console.error("Error:", response.error);
    return;
  }

  console.log(`Agent: ${response.data?.text}`);
}

main();
```
