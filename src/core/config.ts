export interface AppConfig {
  apiKey: string;
  baseURL: string;
  defaultModel: string;
  prompt: string;
  replMode: boolean;
}

export function initializeConfig(): AppConfig {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not found in environment variables");
  }

  const args = process.argv.slice(2);
  const promptIndex = args.indexOf("-p");

  if (promptIndex !== -1 && args[promptIndex + 1]) {
    const prompt = args[promptIndex + 1]!;
    return {
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultModel: "openai/o4-mini",
      prompt,
      replMode: false,
    };
  }

  return {
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultModel: "openai/o4-mini",
    prompt: "",
    replMode: true,
  };
}
