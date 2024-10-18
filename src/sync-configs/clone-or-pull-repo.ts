import * as path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { STORAGE_DIR } from "./sync-configs";
import { Target } from "./targets";

export async function cloneOrPullRepo(target: Target, defaultBranch: string): Promise<void> {
  const repoPath = path.join(__dirname, STORAGE_DIR, target.localDir);
  const git: SimpleGit = simpleGit(repoPath);

  if (await git.checkIsRepo()) {
    try {
      await git.fetch("origin");
      await git.reset(["--hard", `origin/${defaultBranch}`]);
      await git.clean("f", ["-d"]);
    } catch (error) {
      console.error(`Error updating ${target.url}:`, error);
      throw error;
    }
  } else {
    try {
      await git.clone(target.url, repoPath);
    } catch (error) {
      console.error(`Error cloning ${target.url}:`, error);
      throw error;
    }
  }
}
