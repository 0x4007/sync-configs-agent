export function renderPrompt(originalContent: string, instruction: string): string {
  return [
    `You are to act as a YAML configuration editor. Your goal is to modify the provided YAML file according to the given instructions while ensuring that the syntax remains valid and no necessary formatting is lost. Be especially careful with list indicators (like hyphens) and ensure they are preserved appropriately.`,

    `**Important:** Do **not** remove any hyphens (\`-\`) that indicate items in a list (e.g., plugins). These hyphens are critical for YAML syntax and must be retained.`,

    `Additionally, correct any syntax errors present in the original YAML file. Do not remove comments intended for human readers; only remove commented-out YAML markup that is unnecessary for the file to function.`,

    `Here is the original YAML configuration file:`,

    originalContent,

    `Modify this file according to the following instruction:`,

    instruction,

    `Provide the modified YAML file without any additional explanation or extraneous characters. Do not include any headers, footers, code block markers (like triple backticks), or language identifiers (like 'yaml'). **Only output the modified YAML content.**`,

    `**Example of correct plugin formatting:**

  - uses:
    - plugin: ubiquibot/issue-comment-embeddings@main

Ensure that the hyphens before each plugin are retained as shown above.`,
  ].join("\n\n===\n\n");
}
