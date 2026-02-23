import { initializeConfig } from "./core/config";
import { createAIClient, runAgentLoop, runReplMode } from "./core/agent";

async function main() {
  try {
    const config = initializeConfig();
    const client = createAIClient(config);

    if (config.replMode) {
      await runReplMode(client, config);
    } else {
      await runAgentLoop(client, config, config.prompt);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();
