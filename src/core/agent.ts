import OpenAI from "openai";
import readline from "readline";
import type { AppConfig } from "./config";
import { toolDefinitions } from "../tools/definitions";
import { handleToolCall } from "../tools/handlers";
import type { ResponseInputItem, ResponseOutputItem, ResponseFunctionToolCall } from "openai/resources/responses/responses";

const WELCOME_MESSAGE = `
  ____ _                     ____          _      
 / ___| | __ ___      _____ / ___|___   __| | ___ 
| |   | |/ _\` \\ \\ /\\ / / __| |   / _ \\ / _\` |/ _ \\
| |___| | (_| |\\ V  V /\\__ \\ |__| (_) | (_| |  __/
 \\____|_|\\__,_| \\_/\\_/ |___/\\____\\___/ \\__,_|\\___|

A terminal-based AI coding assistant
Type "exit" or "quit" to exit
`;

function createUserMessage(content: string): ResponseInputItem {
  return {
    type: "message",
    role: "user",
    content: [{ type: "input_text", text: content }],
  };
}

function createFunctionCallOutput(call_id: string, output: string): ResponseInputItem {
  return {
    type: "function_call_output",
    call_id,
    output,
  };
}

function isFunctionCall(item: ResponseOutputItem): item is ResponseFunctionToolCall {
  return item.type === "function_call";
}

async function processToolCalls(
  toolCalls: ResponseFunctionToolCall[],
  history: ResponseInputItem[]
): Promise<void> {
  for (const tool of toolCalls) {
    const result = await handleToolCall(tool.name, JSON.parse(tool.arguments));
    history.push(createFunctionCallOutput(tool.call_id, result));
  }
}

async function runAgentIteration(
  client: OpenAI,
  config: AppConfig,
  history: ResponseInputItem[]
): Promise<ResponseOutputItem[] | null> {
  const response = await client.responses.create({
    model: config.defaultModel,
    input: history,
    tools: toolDefinitions,
    max_output_tokens: 1000,
  });

  if (!response.output || response.output.length === 0) {
    return null;
  }

  await handleResponseOutput(response.output);

  for (const item of response.output) {
    history.push(item as ResponseInputItem);
  }

  return response.output;
}

async function handleResponseOutput(output: ResponseOutputItem[]) {
  for (const item of output) {
    switch (item.type) {
      case "function_call":
        console.log(`\n[Tool Call] ${item.name}: ${item.arguments}`);
        break;
      case "message":
        const content = item.content;
        if (Array.isArray(content)) {
          const textContent = content.find((c) => c.type === "output_text");
          if (textContent?.type === "output_text" && textContent.text) {
            console.log(textContent.text);
          }
        }
        break;
    }
  }
}

function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export async function runReplMode(client: OpenAI, config: AppConfig) {
  console.log(WELCOME_MESSAGE);

  const history: ResponseInputItem[] = [];
  const rl = createReadlineInterface();

  const askQuestion = (): Promise<string> => {
    return new Promise((resolve) => {
      rl.question("> ", (answer) => {
        resolve(answer);
      });
    });
  };

  while (true) {
    const prompt = await askQuestion();

    if (prompt.toLowerCase() === "exit" || prompt.toLowerCase() === "quit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    if (!prompt.trim()) {
      continue;
    }

    history.push(createUserMessage(prompt));

    const output = await runAgentIteration(client, config, history);
    if (!output) continue;

    const toolCalls = output.filter(isFunctionCall);
    await processToolCalls(toolCalls, history);
  }
}

export function createAIClient(config: AppConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
}

export async function runAgentLoop(client: OpenAI, config: AppConfig, initialPrompt: string) {
  const history: ResponseInputItem[] = [createUserMessage(initialPrompt)];

  while (true) {
    const output = await runAgentIteration(client, config, history);
    if (!output) break;

    const toolCalls = output.filter(isFunctionCall);

    if (toolCalls.length === 0) {
      const lastMessage = [...output].reverse().find((item) => item.type === "message");
      if (lastMessage?.type === "message") {
        const content = lastMessage.content;
        if (Array.isArray(content)) {
          const textContent = content.find((c) => c.type === "output_text");
          if (textContent?.type === "output_text") {
            return textContent.text || "";
          }
        }
      }
      return "";
    }

    await processToolCalls(toolCalls, history);
  }
}
