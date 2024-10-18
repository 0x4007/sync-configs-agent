export async function renderPrompt(originalContent: string, parserCode: string, manifests: string, repoUrl: string): Promise<string> {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const prompt = [
    `As a YAML configuration editor, modify the following YAML file according to the user's instructions, ensuring valid syntax and preserving formatting. Pay special attention to list indicators (hyphens \`-\`); ensure they are retained and not removed, especially for list items like plugins. Correct any syntax errors in the original YAML.

**Do not alter any URLs in the configuration unless explicitly instructed.**

Here is the original YAML configuration file for ${repoUrl}:`,

    originalContent,

    `Provide only the modified YAML content without any additional explanation, headers, footers, code block markers, or language identifiers.

**Example of correct plugin formatting:**

- uses:
- plugin: ubiquibot/issue-comment-embeddings@main

Ensure the hyphens before each plugin are retained as shown above.

Remember:

• Do not change any URLs unless instructed.
• Keep all comments intended for human readers—including any URLs within them.
• Only remove commented-out YAML code. Do not remove or alter any other comments, notes, or URLs intended for documentation or human understanding.

**Example of a comment with a URL that should be preserved:**

# This is a comment with a URL that should be preserved: https://example.com/documentation

**Ensure all human-readable comments and their contents, especially URLs, are left unchanged unless explicit instructions are provided to modify them.**

For additional context, here is the source code of the YAML configuration parser:`,

    parserCode,

    `Below are the manifests for the plugins in the configuration. Include default values for any missing fields.`,

    manifests,
  ].join("\n\n===\n\n");

  console.trace(prompt);

  return prompt;
}
