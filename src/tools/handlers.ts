import fs from "fs/promises";

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
    let stats;
    try {
      stats = await fs.stat(args.file_path);
    } catch {
      stats = null;
    }
    
    if (stats && stats.size > 0) {
      await fs.appendFile(args.file_path, args.content, "utf-8");
      return `Appended ${args.content.length} bytes to ${args.file_path}`;
    }
    
    await fs.writeFile(args.file_path, args.content, "utf-8");
    return `Wrote ${args.content.length} bytes to ${args.file_path}`;
  } catch (error) {
    return `Error writing file: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function handleToolCall(name: string, args: any): Promise<string> {
  switch (name) {
    case "Read":
      return await handleRead(args);
    case "Write":
      return await handleWrite(args);
    default:
      const msg = `Unknown tool called: ${name}`;
      console.warn(msg);
      return msg;
  }
}
