import inquirer from "inquirer";
import { processRepositories } from "./process-repositories";

export async function syncConfigsInteractive() {
  const response = await inquirer.prompt([
    {
      type: "input",
      name: "instruction",
      message: "Enter the changes you want to make (in plain English):",
    },
  ]);
  await processRepositories(response.instruction, true);
}
