import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5-nano",
  input: "Say I'm ClawsCode, a terminal-based AI coding assistant.",
});

console.log(response.output_text);
