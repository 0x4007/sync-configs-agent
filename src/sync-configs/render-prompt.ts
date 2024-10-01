export function renderPrompt(originalContent: string, instruction: string): string {
  return [
    `Your most important instruction components are delimited with === triple equal signs on their own line. This is because we are working with multiple levels of delimiters like the triple backticks.`,

    `You need to modify YAML configurations according to provided instructions. In addition, be sure to error correct any mistakes in the original YAML file. For example, if the original YAML file has a syntax error, be sure to correct it in your output. Don't remove commented out YML that seem like they are for humans; only remove commented out YML markup that is not needed for the file to function should be removed.`,

    `Here is a YAML configuration file:`,

    originalContent,

    `Modify this file according to the following instruction:`,

    instruction,

    `Provide the modified YAML file without any additional explanation. Be extra careful to ONLY include YML compliant syntax in your response, this especially includes any instance of triple hyphens or triple backticks because your direct output will be used as the modified file, and will be uploaded straight to the repository. Do not include any additional comments or explanations. Do not add any headers or footers. Do not include any additional information. Just the modified YML file.`,

    `Lastly, "plugins" are in an array, so ensure that you retain the hyphen as a prefix before each plugin line.`,
  ].join("\n\n===\n\n");
}
