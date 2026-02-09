import OpenAI from "openai";
import type { AppConfig } from "./config";
import { toolDefinitions } from "../tools/definitions";
import { handleToolCall } from "../tools/handlers";
import type { ResponseInputItem, ResponseOutputItem } from "openai/resources/responses/responses";

export function createAIClient(config: AppConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
}

export async function runAgentLoop(client: OpenAI, config: AppConfig, initialPrompt: string) {
  const history: ResponseInputItem[] = [
    {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: initialPrompt }],
    },
  ];

  while (true) {
    const response = await client.responses.create({
      model: config.defaultModel,
      input: history,
      tools: toolDefinitions,
      // TODO: remove after testing
      max_output_tokens: 1000,
    });

    if (!response.output || response.output.length === 0) {
      break;
    }

    await handleResponseOutput(response.output);

    for (const item of response.output) {
      history.push(item as ResponseInputItem);
    }

    const toolCalls = response.output.filter((item) => item.type === "function_call");

    if (toolCalls.length === 0) {
      const lastMessage = [...response.output]
        .reverse()
        .find((item) => item.type === "message") as any;
      if (lastMessage) {
        const textContent = lastMessage.content?.find((c: any) => c.type === "output_text");
        return textContent?.text || "";
      }
      return "";
    }

    for (const tool of toolCalls) {
      if (tool.type === "function_call") {
        const result = await handleToolCall(tool.name, JSON.parse(tool.arguments));
        history.push({
          type: "function_call_output",
          call_id: tool.call_id,
          output: result,
        } as ResponseInputItem);
      }
    }
  }
}

export async function handleResponseOutput(output: ResponseOutputItem[]) {
  for (const item of output) {
    switch (item.type) {
      case "function_call":
        console.log(`\n[Tool Call] ${item.name}: ${item.arguments}`);
        break;
      case "message":
        const textContent = (item as any).content?.find((c: any) => c.type === "output_text");
        if (textContent?.text) {
          console.log(textContent.text);
        }
        break;
    }
  }
}
