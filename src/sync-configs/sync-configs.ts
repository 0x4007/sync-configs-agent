import { Octokit } from "@octokit/rest";
import * as fs from "fs";
import inquirer from "inquirer";
import * as path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { cloneOrPullRepo } from "./clone-or-pull-repo";
import { getDefaultBranch } from "./get-default-branch";
import { getDiff } from "./get-diff";
import { getModifiedContent } from "./get-modified-content";
import { repositories } from "./repositories";

export const REPOS_DIR = "../organizations";

export async function syncConfigs() {
  // Ensure the repos directory exists
  const reposPath = path.resolve(__dirname, REPOS_DIR);
  if (!fs.existsSync(reposPath)) {
    fs.mkdirSync(reposPath, { recursive: true });
  }
  // Start cloning or pulling repositories in the background
  const clonePromises = repositories.map(async (repo) => {
    const defaultBranch = await getDefaultBranch(repo.url);
    return cloneOrPullRepo(repo, defaultBranch);
  });

  let instruction: string;
  if (process.env.NON_INTERACTIVE === "true") {
    instruction = process.env.INPUT_STRING || "";
  } else {
    // Get user input while repositories are being cloned/pulled
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "instruction",
        message: "Enter the changes you want to make (in plain English):",
      },
    ]);
    instruction = response.instruction;
  }

  // Wait for all clone/pull operations to complete
  await Promise.all(clonePromises);

  // Find and remove the parser repository from the array
  const parserRepoIndex = repositories.findIndex((repo) => repo.type === "parser");
  if (parserRepoIndex === -1) {
    console.error("Parser repository not found. Unable to proceed.");
    return;
  }
  const [parserRepo] = repositories.splice(parserRepoIndex, 1);

  // Read the parser file content
  const parserFilePath = path.join(__dirname, REPOS_DIR, parserRepo.localDir, parserRepo.filePath);
  if (!fs.existsSync(parserFilePath)) {
    console.error(`Parser file ${parserFilePath} does not exist. Unable to proceed.`);
    return;
  }
  const parserCode = fs.readFileSync(parserFilePath, "utf8");

  // Process each file
  for (const repo of repositories) {
    const filePath = path.join(__dirname, REPOS_DIR, repo.localDir, repo.filePath);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${repo.url} as the file ${repo.filePath} does not exist.`);
      continue;
    }
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Use OpenAI API to get the modified content
    const modifiedContent = await getModifiedContent(fileContent, instruction, parserCode);

    // Save the modified content to a temporary file
    const tempFilePath = `${filePath}.modified`;
    fs.writeFileSync(tempFilePath, modifiedContent, "utf8");

    // Show the differences
    console.log(`\nDifferences for ${filePath}:`);
    const diff = await getDiff(filePath, tempFilePath);
    console.log(diff);

    let isConfirmed: boolean;
    if (process.env.NON_INTERACTIVE === "true") {
      isConfirmed = true;
    } else {
      // Prompt the user to confirm
      const response = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Do you want to apply these changes to ${repo.url}?`,
        },
      ]);
      isConfirmed = response.confirm;
    }

    if (isConfirmed) {
      // Replace the original file with the modified content
      fs.writeFileSync(filePath, modifiedContent, "utf8");

      // Commit and push the changes
      const git: SimpleGit = simpleGit(path.join(__dirname, REPOS_DIR, repo.localDir));
      const defaultBranch = await getDefaultBranch(repo.url);
      const branchName = `sync-configs-${Date.now()}`;
      await git.checkoutLocalBranch(branchName);
      await git.add(repo.filePath);
      await git.commit(`chore: update using @ubiquity/sync-configs

${instruction}
`);

      if (process.env.NON_INTERACTIVE === "true") {
        await git.push("origin", branchName);
        console.log(`Changes pushed to ${repo.url} in branch ${branchName}`);

        // Create pull request
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

        const [owner, repoName] = repo.url.split("/").slice(-2);

        try {
          const { data: pullRequest } = await octokit.pulls.create({
            owner,
            repo: repoName,
            title: `Sync configs: ${instruction}`,
            head: branchName,
            base: defaultBranch,
            body: `This pull request was automatically created by the sync-configs tool.\n\nInstruction: ${instruction}`,
          });

          console.log(`Pull request created: ${pullRequest.html_url}`);
        } catch (error) {
          console.error(`Failed to create pull request: ${error.message}`);
        }
      } else {
        await git.push("origin", defaultBranch);
        console.log(`Changes pushed to ${repo.url}`);
      }
    } else {
      console.log(`Changes to ${repo.url} discarded.`);
    }

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
  }
}
