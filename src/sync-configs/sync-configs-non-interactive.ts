import { processRepositories } from "./process-repositories";

export async function syncConfigsNonInteractive() {
  const instruction = process.env.INPUT_STRING;
  if (!instruction) {
    throw new Error(
      "No instruction provided. You need to pass in an instruction either as command-line arguments or through the INPUT_STRING environment variable."
    );
  }
  await processRepositories(instruction, true);
}
