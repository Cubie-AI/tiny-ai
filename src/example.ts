import z from "zod";
import { TinyAgent } from "./agent";
import { TinyAnthropic } from "./providers/anthropic";

async function main() {
  const anthropic = new TinyAnthropic({
    apiKey: "ANTHROPIC_API_KEY",
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
