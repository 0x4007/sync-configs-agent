import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { createPullRequest } from "./create-pull-request";
import { getDefaultBranch } from "./get-default-branch";
import { Repo, REPOS_DIR } from "./sync-configs";
import * as fs from "fs";

export async function applyChanges({
  repo,
  filePath,
  modifiedContent,
  instruction,
  isInteractive,
  forceBranch,
}: {
  repo: Repo;
  filePath: string;
  modifiedContent: string;
  instruction: string;
  isInteractive: boolean;
  forceBranch?: string;
}) {
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

  await git.checkout(defaultBranch);
  await git.pull("origin", defaultBranch);

  fs.writeFileSync(filePath, modifiedContent, "utf8");

  await git.add(repo.filePath);

  await git.commit(["chore: update using UbiquityOS Configurations Agent", instruction].join("\n\n"));

  try {
    if (isInteractive) {
      await git.push("origin", defaultBranch);
      console.log(`Changes pushed to ${repo.url} in branch ${defaultBranch}`);
    } else {
      const branchName = `sync-configs-${Date.now()}`;
      await git.checkoutLocalBranch(branchName);
      await git.push("origin", branchName, ["--set-upstream"]);
      await createPullRequest({ repo, branchName, defaultBranch, instruction });
      console.log(`Pull request created for ${repo.url} from branch ${branchName} to ${defaultBranch}`);
    }
  } catch (error) {
    console.error(`Error applying changes to ${repo.url}:`, error);
  }
}
