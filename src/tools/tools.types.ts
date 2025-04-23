import { Tool } from "ai";

export interface BuildToolParams {
  description: string;
  parameters?: Tool["parameters"];
  handler?: (args: any) => Promise<any>;
  context?: any;
}
