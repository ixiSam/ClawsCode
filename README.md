# ClawsCode
- A terminal-based AI coding assistant (**A simple Claude Code clone**)
- Uses OpenRouter's API

## Usage

### Prerequisites
- [Bun](https://bun.sh) runtime
- OpenRouter API key

### Run
```bash
# Set your API key
export OPENROUTER_API_KEY="your-key-here"

# Run with a prompt
bun run src/index.ts -p "your prompt here"
```

## Project Structure

```
src/
├── index.ts          # Entry point
├── core/
│   ├── agent.ts      # AI client & agent loop
│   └── config.ts     # Configuration management
└── tools/
    ├── definitions.ts   # Tool schemas (advertising)
    └── handlers.ts       # Tool execution logic
```

## What I learned

- **Setting up an AI agent** - Initializing an AI client with API keys and base URLs (OpenRouter)
- **Standard API for AI agents** - Using the OpenAI Responses API (not Chat API) for agentic workflows
- **Tool advertising** - Defining tools using OpenAI's FunctionTool format with name, description, and JSON schema parameters
- **Tool implementation** - Creating handlers (Read, Write, Bash) that execute actual filesystem/shell operations
- **Agent loop** - Building a conversation loop that sends history to the model, handles tool calls by executing handlers and appending results, and continues until the model returns a final message
- **History management** - Maintaining conversation context by appending user messages, assistant responses, and tool outputs
