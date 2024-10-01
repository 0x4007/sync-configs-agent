import axios from "axios";
import * as fs from "fs";
import inquirer from "inquirer";
import * as path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { getDefaultBranch } from "./get-default-branch";
import { getDiff } from "./get-diff";
import { renderPrompt } from "./render-prompt";
import { repositories } from "./repositories";

const REPOS_DIR = "../organizations";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set.");
  process.exit(1);
}

async function cloneOrPullRepo(repo: { url: string; localDir: string }, defaultBranch: string) {
  const repoDir = path.resolve(__dirname, REPOS_DIR, repo.localDir);
  const git: SimpleGit = simpleGit();

  if (fs.existsSync(repoDir)) {
    // Repo already cloned, do git pull
    console.log(`Pulling latest changes for ${repo.url}`);
    await git.cwd(repoDir);
    await git.checkout(defaultBranch);
    await git.pull("origin", defaultBranch);
  } else {
    // Clone the repo
    console.log(`Cloning ${repo.url}`);
    try {
      await git.clone(repo.url, repoDir);
      await git.cwd(repoDir);
      await git.checkout(defaultBranch);
    } catch (error) {
      if (error instanceof Error && error.message.includes("destination path already exists")) {
        console.log(`The directory ${repo.localDir} already exists. Pulling instead.`);
        await git.cwd(repoDir);
        await git.checkout(defaultBranch);
        await git.pull("origin", defaultBranch);
      } else {
        throw error;
      }
    }
  }
}

export async function syncConfigs() {
  // Ensure the repos directory exists
  const reposPath = path.resolve(__dirname, REPOS_DIR);
  if (!fs.existsSync(reposPath)) {
    fs.mkdirSync(reposPath, { recursive: true });
  }

  // Clone or pull the repositories
  for (const repo of repositories) {
    const defaultBranch = await getDefaultBranch(repo.url);
    await cloneOrPullRepo(repo, defaultBranch);
  }

  // Get user input
  const { instruction } = await inquirer.prompt([
    {
      type: "input",
      name: "instruction",
      message: "Enter the changes you want to make (in plain English):",
    },
  ]);

  // Process each file
  for (const repo of repositories) {
    const filePath = path.join(__dirname, REPOS_DIR, repo.localDir, repo.filePath);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${repo.url} as the file ${repo.filePath} does not exist.`);
      continue;
    }
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Use OpenAI API to get the modified content
    const modifiedContent = await getModifiedContent(fileContent, instruction);

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
      await git.commit(`Update ${repo.filePath} via script`);
      await git.push("origin", defaultBranch);
      console.log(`Changes pushed to ${repo.url}`);
    } else {
      console.log(`Changes to ${repo.url} discarded.`);
    }

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
  }
}

async function getModifiedContent(originalContent: string, instruction: string): Promise<string> {
  const prompt = renderPrompt(originalContent, instruction);

  // console.trace(prompt)

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an assistant that modifies YAML configuration files based on instructions.",
        },
        { role: "user", content: prompt },
      ],
      stream: true,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      responseType: "stream",
    }
  );

  let fullContent = "";
  for await (const chunk of response.data) {
    const lines = chunk
      .toString()
      .split("\n")
      .filter((line) => line.trim() !== "");
    for (const line of lines) {
      const message = line.replace(/^data: /, "");
      if (message === "[DONE]") {
        return fullContent.trim();
      }
      try {
        const parsed = JSON.parse(message);
        const content = parsed.choices[0].delta.content;
        if (content) {
          fullContent += content;
          process.stdout.write(content);
        }
      } catch (error) {
        console.error("Error parsing stream:", error);
      }
    }
  }

  return fullContent.trim();
}
