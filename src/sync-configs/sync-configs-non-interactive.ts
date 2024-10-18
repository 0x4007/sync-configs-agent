import { processRepositories } from "./process-repositories";

export async function syncConfigsNonInteractive() {
  const instruction = process.env.EDITOR_INSTRUCTION;
  if (!instruction) {
    throw new Error(
      "No instruction provided. You need to pass in an instruction either as command-line arguments or through the EDITOR_INSTRUCTION environment variable."
    );
  }
  await processRepositories(instruction, true);
}
