export function renderPrompt(originalContent: string, parserCode: string): string {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const prompt = [
    `
    - You are to act as a YAML configuration editor.
    - Your goal is to modify the provided YAML file according to the user's instructions while ensuring that the syntax remains valid and no necessary formatting is lost.
    - Be especially careful with list indicators (like hyphens) and ensure they are preserved appropriately.
    - **Important:** Do **not** remove any hyphens (\`-\`) that indicate items in a list (e.g., plugins). These hyphens are critical for YAML syntax and must be retained.
    - Additionally, correct any syntax errors present in the original YAML file.

    - **Do not alter any URLs in the configuration file. Assume that all URLs provided are correct and must remain unchanged unless the user specifically requests a modification to URLs otherwise.**
    - Here is the original YAML configuration file:`,

    originalContent,

    `Provide the modified YAML file without any additional explanation or extraneous characters. Do not include any headers, footers, code block markers (like triple backticks), or language identifiers (like 'yaml'). **Only output the modified YAML content.**

**Example of correct plugin formatting:**

- uses:
  - plugin: ubiquibot/issue-comment-embeddings@main

Ensure that the hyphens before each plugin are retained as shown above. **Remember, do not change any URLs in the configuration.** and do not remove comments intended for human readers; only remove commented-out YAML code. Finally, for additional context, here is the source code of the yml configuration parser for your reference:`,

    parserCode,
  ].join("\n\n===\n\n");

  // console.trace(prompt);

  return prompt;
}
