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
  {
    type: "function",
    name: "Write",
    description: "Write content to a file",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "The path of the file to write to",
        },
        content: {
          type: "string",
          description: "The content to write to the file",
        },
      },
      required: ["file_path", "content"],
    },
    strict: true,
  },
  {
    type: "function",
    name: "Bash",
    description: "Execute a bash command in the terminal",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The bash command to execute",
        },
      },
      required: ["command"],
    },
    strict: true,
  },
];