import Anthropic from "@anthropic-ai/sdk";
import { renderPrompt } from "./render-prompt";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set.");
  process.exit(1);
}

export async function getModifiedContent(originalContent: string, instruction: string, parserCode: string): Promise<string> {
  const prompt = renderPrompt(originalContent, instruction, parserCode);

  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  const stream = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4000,
    temperature: 0,
    system: prompt,
    messages: [
      {
        role: "user",
        content: instruction,
      },
    ],
    stream: true,
  });

  let fullContent = "";
  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta") {
      const content = chunk.delta.text;
      if (content) {
        fullContent += content;
        process.stdout.write(content);
      }
    }
  }

  return fullContent.trim();
}
