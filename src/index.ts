import { initializeConfig } from "./core/config";
import { createAIClient, getChatResponse, handleResponseOutput } from "./core/agent";

async function main() {
  try {
    const config = initializeConfig();
    const client = createAIClient(config);

    const response = await getChatResponse(client, config, config.prompt);

    if (response.output?.length) {
      await handleResponseOutput(response.output);
    } else {
      console.log("No output from the model");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();