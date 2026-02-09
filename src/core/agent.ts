import OpenAI from "openai";
import type { AppConfig } from "./config";
import { toolDefinitions } from "../tools/definitions";
import { handleToolCall } from "../tools/handlers";


export function createAIClient(config: AppConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
}

export async function getChatResponse(client: OpenAI, config: AppConfig, prompt: string) {
  return client.responses.create({
    model: config.defaultModel,
    input: [
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: prompt }],
      },
    ],
    tools: toolDefinitions,
    max_output_tokens: 1000, // TODO: Remove after testing
  });
}

export async function handleResponseOutput(output: any[]) {
  for (const item of output) {
    switch (item.type) {
      case "function_call":
        await handleToolCall(item.name, JSON.parse(item.arguments));
        break;
      case "message":
        const textContent = item.content?.find((c: any) => c.type === "output_text");
        if (textContent?.text) {
          console.log(textContent.text);
        }
        break;
    }
  }
}
