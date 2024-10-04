import inquirer from "inquirer";
export async function confirmChanges(repoUrl: string): Promise<boolean> {
  const response = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Do you want to apply these changes to ${repoUrl}?`,
    },
  ]);
  return response.confirm;
}
