import OpenAI from "openai";
import { toolDefinitions } from "./tools";
import fs from "fs";


async function main(){
  const[, , flag, prompt] = process.argv;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if(!apiKey){
    throw new Error("OPENROUTER_API_KEY not found in environment variables");
  }
  if (flag !== "-p" || !prompt){
    console.error("error: use -p flag to provide a prompt");
    process.exit(1);
  }
  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
  const response = await client.responses.create({
    model: "openai/o4-mini",
    input: [
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt
          }
        ]
      }
    ],
    tools: toolDefinitions,
    // TODO: remove this, just for testing using the limited tokens api key
    max_output_tokens: 1000,
  });

  if (response.output && response.output.length > 0) {
    for (const item of response.output) {
      if (item.type === "function_call") {
        const functionName = item.name;
        const functionArgs = JSON.parse(item.arguments);
        if (functionName === "Read") {
          const filePath = functionArgs.file_path;
          const fileContent = fs.readFileSync(filePath, "utf-8");
          console.log(fileContent);
        }
      } else if (item.type === "message") {
        // Access the text from the content array
        if (item.content && item.content.length > 0) {
          const textContent = item.content.find(c => c.type === "output_text");
          if (textContent) {
            console.log(textContent.text);
          }
        }
      }
    }
  } else {
    console.log("No output from the model");
  }
}
main();