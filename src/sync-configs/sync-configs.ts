import * as fs from "fs";
import inquirer from "inquirer";
import * as path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { getDefaultBranch } from "./get-default-branch";
import { getDiff } from "./get-diff";
import { renderPrompt } from "./render-prompt";
import { repositories } from "./repositories";

const REPOS_DIR = "../organizations";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set.");
  process.exit(1);
}

function cloneOrPullRepo(repo: { url: string; localDir: string }, defaultBranch: string): Promise<void> {
  const repoDir = path.resolve(__dirname, REPOS_DIR, repo.localDir);
  const git: SimpleGit = simpleGit();

  return new Promise((resolve, reject) => {
    if (fs.existsSync(repoDir)) {
      // Repo already cloned, do git pull
      // console.log(`Pulling latest changes for ${repo.url}`);
      git
        .cwd(repoDir)
        .then(() => Promise.all([git.checkout(defaultBranch), git.pull("origin", defaultBranch)]))
        .then(() => resolve())
        .catch(reject);
    } else {
      // Clone the repo
      console.log(`Cloning ${repo.url}`);
      git
        .clone(repo.url, repoDir)
        .then(() => git.cwd(repoDir))
        .then(() => git.checkout(defaultBranch))
        .then(() => resolve())
        .catch((error) => {
          if (error instanceof Error && error.message.includes("destination path already exists")) {
            console.log(`The directory ${repo.localDir} already exists. Pulling instead.`);
            git
              .cwd(repoDir)
              .then(() => Promise.all([git.checkout(defaultBranch), git.pull("origin", defaultBranch)]))
              .then(() => resolve())
              .catch(reject);
          } else {
            reject(error);
          }
        });
    }
  });
}

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

  // Get user input while repositories are being cloned/pulled
  const { instruction } = await inquirer.prompt([
    {
      type: "input",
      name: "instruction",
      message: "Enter the changes you want to make (in plain English):",
    },
  ]);

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

    // Prompt the user to confirm
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Do you want to apply these changes to ${repo.url}?`,
      },
    ]);

    if (confirm) {
      // Replace the original file with the modified content
      fs.writeFileSync(filePath, modifiedContent, "utf8");

      // Commit and push the changes
      const git: SimpleGit = simpleGit(path.join(__dirname, REPOS_DIR, repo.localDir));
      const defaultBranch = await getDefaultBranch(repo.url);
      await git.add(repo.filePath);
      await git.commit(`chore: update using @ubiquity/sync-configs

${instruction}
`);
      await git.push("origin", defaultBranch);
      console.log(`Changes pushed to ${repo.url}`);
    } else {
      console.log(`Changes to ${repo.url} discarded.`);
    }

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
  }
}

import Anthropic from "@anthropic-ai/sdk";

async function getModifiedContent(originalContent: string, instruction: string, parserCode: string): Promise<string> {
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
