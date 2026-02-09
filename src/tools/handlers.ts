import fs from "fs/promises";

export async function handleRead(args: { file_path: string }): Promise<string> {
    try {
        const content = await fs.readFile(args.file_path, "utf-8");
        console.log(content);
        return content;
    } catch (error) {
        console.error(`Error reading file ${args.file_path}:`, error);
        return `Error reading file: ${error instanceof Error ? error.message : String(error)}`;
    }
}

export async function handleToolCall(name: string, args: any): Promise<void> {
    switch (name) {
        case "Read":
            await handleRead(args);
            break;
        default:
            console.warn(`Unknown tool called: ${name}`);
    }
}
