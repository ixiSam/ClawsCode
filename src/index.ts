import { initializeConfig } from "./core/config";
import { createAIClient, runAgentLoop } from "./core/agent";

async function main() {
  try {
    const config = initializeConfig();
    const client = createAIClient(config);

    const finalMessage = await runAgentLoop(client, config, config.prompt);

    if (finalMessage) {
      console.log(finalMessage);
    } else {
      console.log("No response from the model");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();
