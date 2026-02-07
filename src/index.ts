import OpenAI from "openai";

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
    model: "openai/gpt-5-nano",
    input: prompt,
  });

console.log(response.output_text);
}

main();