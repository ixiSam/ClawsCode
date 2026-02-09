import type { FunctionTool } from "openai/resources/responses/responses";

export const toolDefinitions: FunctionTool[] = [
  {
    type: "function",
    name: "Read",
    description: "Read and return the contents of a file",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "The path to the file to read",
        },
      },
      required: ["file_path"],
    },
    strict: true,
  },
];
