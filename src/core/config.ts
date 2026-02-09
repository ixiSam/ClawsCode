export interface AppConfig {
  apiKey: string;
  baseURL: string;
  defaultModel: string;
  prompt: string;
}

export function initializeConfig(): AppConfig {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not found in environment variables");
  }

  const [, , flag, prompt] = process.argv;
  if (flag !== "-p" || !prompt) {
    console.error("error: use -p flag to provide a prompt");
    process.exit(1);
  }

  return {
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultModel: "openai/o4-mini",
    prompt,
  };
}
