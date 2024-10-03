import * as fs from "fs";
import inquirer from "inquirer";
import * as path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { cloneOrPullRepo } from "./clone-or-pull-repo";
import { getDefaultBranch } from "./get-default-branch";
import { getDiff } from "./get-diff";
import { getModifiedContent } from "./get-modified-content";
import { repositories } from "./repositories";
import { createPullRequest } from "./create-pull-request";

export type Repo = (typeof repositories)[number];

export const REPOS_DIR = "../organizations";

export async function syncConfigsAgent() {
  const args = process.argv.slice(2);
  const shouldPush = args.includes("--push");

  if (shouldPush) {
    await pushModifiedContents();
    return;
  }

  const reposPath = path.resolve(__dirname, REPOS_DIR);
  if (!fs.existsSync(reposPath)) {
    fs.mkdirSync(reposPath, { recursive: true });
  }

  const clonePromises = repositories.map(async (repo) => {
    const defaultBranch = await getDefaultBranch(repo.url);
    return cloneOrPullRepo(repo, defaultBranch);
  });

  await Promise.all(clonePromises);

  if (process.env.NON_INTERACTIVE === "true") {
    await syncConfigsNonInteractive();
  } else {
    await syncConfigsInteractive();
  }
}

async function pushModifiedContents() {
  for (const repo of repositories) {
    if (repo.type === "parser") {
      console.log(`Skipping parser repository ${repo.url}`);
      continue;
    }
    const filePath = path.join(__dirname, REPOS_DIR, repo.localDir, repo.filePath);
    const modifiedFilePath = `${filePath}.modified`;

    if (fs.existsSync(modifiedFilePath)) {
      const modifiedContent = fs.readFileSync(modifiedFilePath, "utf8");
      const defaultBranch = await getDefaultBranch(repo.url);
      await applyChanges(repo, filePath, modifiedContent, "Rerunning using `--push` flag. Original prompt has not been retained.", true, defaultBranch);
    } else {
      console.log(`No modified file found for ${repo.url}. Skipping.`);
    }
  }
}

async function syncConfigsNonInteractive() {
  const instruction = process.env.INPUT_STRING || "";
  await processRepositories(instruction, true);
}

async function syncConfigsInteractive() {
  const response = await inquirer.prompt([
    {
      type: "input",
      name: "instruction",
      message: "Enter the changes you want to make (in plain English):",
    },
  ]);
  await processRepositories(response.instruction, false);
}

async function processRepositories(instruction: string, isNonInteractive: boolean) {
  const parserRepoIndex = repositories.findIndex((repo) => repo.type === "parser");
  if (parserRepoIndex === -1) {
    console.error("Parser repository not found. Unable to proceed.");
    return;
  }
  const [parserRepo] = repositories.splice(parserRepoIndex, 1);

  const parserFilePath = path.join(__dirname, REPOS_DIR, parserRepo.localDir, parserRepo.filePath);
  if (!fs.existsSync(parserFilePath)) {
    console.error(`Parser file ${parserFilePath} does not exist. Unable to proceed.`);
    return;
  }
  const parserCode = fs.readFileSync(parserFilePath, "utf8");

  for (const repo of repositories) {
    if (repo.type !== "parser") {
      await processRepository(repo, instruction, parserCode, isNonInteractive);
    }
  }
}

async function processRepository(repo: Repo, instruction: string, parserCode: string, isNonInteractive: boolean) {
  const filePath = path.join(__dirname, REPOS_DIR, repo.localDir, repo.filePath);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${repo.url} as the file ${repo.filePath} does not exist.`);
    return;
  }
  const fileContent = fs.readFileSync(filePath, "utf8");

  const modifiedContent = await getModifiedContent(fileContent, instruction, parserCode);

  const tempFilePath = `${filePath}.modified`;
  fs.writeFileSync(tempFilePath, modifiedContent, "utf8");

  console.log(`\nDifferences for ${filePath}:`);
  const diff = await getDiff(filePath, tempFilePath);
  console.log(diff);

  const isConfirmed = isNonInteractive || (await confirmChanges(repo.url));

  if (isConfirmed) {
    await applyChanges(repo, filePath, modifiedContent, instruction, isNonInteractive);
  } else {
    console.log(`Changes to ${repo.url} discarded.`);
  }

  // fs.unlinkSync(tempFilePath);
}

async function confirmChanges(repoUrl: string): Promise<boolean> {
  const response = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Do you want to apply these changes to ${repoUrl}?`,
    },
  ]);
  return response.confirm;
}

async function applyChanges(repo: Repo, filePath: string, modifiedContent: string, instruction: string, isNonInteractive: boolean, forceBranch?: string) {
  fs.writeFileSync(filePath, modifiedContent, "utf8");

  const git: SimpleGit = simpleGit({
    baseDir: path.join(__dirname, REPOS_DIR, repo.localDir),
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
  });

  git.outputHandler((command, stdout, stderr) => {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
  });

  const defaultBranch = forceBranch || (await getDefaultBranch(repo.url));
  console.log(`Default branch for ${repo.url} is ${defaultBranch}`);

  // Always checkout the default branch
  await git.checkout(defaultBranch);
  await git.pull("origin", defaultBranch);

  const branchName = `sync-configs-${Date.now()}`;
  await git.checkoutLocalBranch(branchName);

  await git.add(repo.filePath);

  const status = await git.status();
  console.log(`Git status before commit:`, status);

  await git.commit(
    `chore: update using UbiquityOS Configurations Agent

${instruction}
    `
  );

  try {
    if (isNonInteractive) {
      await git.push("origin", branchName, ["--set-upstream"]);
      await createPullRequest(repo, branchName, defaultBranch, instruction);
      console.log(`Pull request created for ${repo.url} from branch ${branchName} to ${defaultBranch}`);
    } else {
      await git.push("origin", defaultBranch);
      console.log(`Changes pushed directly to ${repo.url} in branch ${defaultBranch}`);
    }
  } catch (error) {
    console.error(`Error applying changes to ${repo.url}:`, error);
  }
}
