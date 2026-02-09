import fs from "fs/promises";

export async function handleRead(args: { file_path: string }): Promise<string> {
  try {
    const content = await fs.readFile(args.file_path, "utf-8");
    return content;
  } catch (error) {
    return `Error reading file: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function handleToolCall(name: string, args: any): Promise<string> {
  switch (name) {
    case "Read":
      return await handleRead(args);
    default:
      const msg = `Unknown tool called: ${name}`;
      console.warn(msg);
      return msg;
  }
}
