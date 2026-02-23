import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function handleRead(args: { file_path: string }): Promise<string> {
  try {
    const content = await fs.readFile(args.file_path, "utf-8");
    return content;
  } catch (error) {
    return `Error reading file: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function handleWrite(args: {file_path: string, content: string}): Promise<string>{
  try {
    await fs.writeFile(args.file_path, args.content, "utf-8");
    return `Wrote ${args.content.length} bytes to ${args.file_path}`;
  } catch (error) {
    return `Error writing file: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function handleBash(args: { command: string }): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(args.command);
    return stdout + stderr;
  } catch (error) {
    return `Error executing command: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function handleToolCall(name: string, args: unknown): Promise<string> {
  switch (name) {
    case "Read":
      return handleRead(args as { file_path: string });
    case "Write":
      return handleWrite(args as { file_path: string; content: string });
    case "Bash":
      return handleBash(args as { command: string });
    default:
      const msg = `Unknown tool called: ${name}`;
      console.warn(msg);
      return msg;
  }
}
