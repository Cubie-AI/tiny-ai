# Tiny AI

A small, unopinionated and easily extensible ai framework

## Example

Here is some standalone code for creating your `TinyAgent`

```typescript
import z from "zod";
import { TinyAgent } from "./agent";
import { TinyAnthropic } from "./providers/anthropic";

async function main() {
  const anthropic = new TinyAnthropic({
    apiKey: "ANTHROPIC_KEY",
  });

  const agent = new TinyAgent({
    name: "TinyAgent",
    system: "A tiny agent",
    provider: anthropic,
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

To run the example use the following command:

```
npm run example
```

Output

```
Agent called getWeather with args: {"location":"Los Angeles"}
Based on the results:
- The weather in Los Angeles shows a temperature of 100 (presumably degrees Fahrenheit), which is quite hot.
- The population of China is reported as 1,000,000, though this seems to be a simplified or placeholder number and may not reflect the actual current population.

Please note that the population figure appears to be a rough estimate or placeholder, and the actual population of China is much higher (around 1.4 billion as of recent estimates).

Is there anything else I can help you with?
```
