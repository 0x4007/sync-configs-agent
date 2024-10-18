import * as fs from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { createPullRequest } from "./create-pull-request";
import { getDefaultBranch } from "./get-default-branch";
import { STORAGE_DIR } from "./sync-configs";
import { Target } from "./targets";

export async function applyChanges({
  target,
  filePath,
  modifiedContent,
  instruction,
  isInteractive,
  forceBranch,
}: {
  target: Target;
  filePath: string;
  modifiedContent: string;
  instruction: string;
  isInteractive: boolean;
  forceBranch?: string;
}) {
  const git: SimpleGit = simpleGit({
    baseDir: path.join(__dirname, STORAGE_DIR, target.localDir),
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
  });

  git.outputHandler((command, stdout, stderr) => {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
  });

  // Check for global Git config
  const globalUserName = await git.getConfig("user.name", "global");
  const globalUserEmail = await git.getConfig("user.email", "global");

  let isBot = false;
  if (!globalUserName.value || !globalUserEmail.value) {
    // If global config is not set, use the bot credentials
    const userName = "UbiquityOS Configurations Agent[bot]";
    const userEmail = "ubiquity-os[bot]@users.noreply.github.com";

    await git.addConfig("user.name", userName, false, "local");
    await git.addConfig("user.email", userEmail, false, "local");
    console.log("Using bot credentials for Git operations.");
    isBot = true;
  } else {
    console.log("Using global Git config for operations.");
  }

  const defaultBranch = forceBranch || (await getDefaultBranch(target.url));

  await git.checkout(defaultBranch);
  await git.pull("origin", defaultBranch);

  fs.writeFileSync(filePath, modifiedContent, "utf8");

  await git.add(target.filePath);

  let commitMessage: string;
  if (isBot && process.env.GITHUB_ACTOR) {
    commitMessage = ["chore: update", instruction, `Triggered by @${process.env.GITHUB_ACTOR}`].join("\n\n");
  } else {
    commitMessage = ["chore: update using UbiquityOS Configurations Agent", instruction].join("\n\n");
  }

  await git.commit(commitMessage);

  try {
    if (isInteractive) {
      await git.push("origin", defaultBranch, {
        "--force-with-lease": null,
        ...(process.env.GITHUB_APP_TOKEN ? { "-o": `oauth_token=${process.env.GITHUB_APP_TOKEN}` } : {}),
      });
      console.log(`Changes pushed to ${target.url} in branch ${defaultBranch}`);
    } else {
      const branchName = `sync-configs-${Date.now()}`;
      await git.checkoutLocalBranch(branchName);
      await git.push("origin", branchName, {
        "-u": null,
        ...(process.env.GITHUB_APP_TOKEN ? { "-o": `oauth_token=${process.env.GITHUB_APP_TOKEN}` } : {}),
      });
      await createPullRequest({ target, branchName, defaultBranch, instruction });
      console.log(`Pull request created for ${target.url} from branch ${branchName} to ${defaultBranch}`);
    }
  } catch (error) {
    console.error(`Error applying changes to ${target.url}:`, error);
  }
}
