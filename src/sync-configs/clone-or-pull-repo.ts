import * as path from "path";
import * as fs from "fs";
import simpleGit, { SimpleGit } from "simple-git";
import { STORAGE_DIR } from "./sync-configs";
import { Target } from "./targets";

export async function cloneOrPullRepo(target: Target, defaultBranch: string): Promise<void> {
  const repoPath = path.join(__dirname, STORAGE_DIR, target.localDir);

  if (fs.existsSync(repoPath)) {
    // The repository directory exists; initialize git with this directory
    const git: SimpleGit = simpleGit(repoPath);

    if (await git.checkIsRepo()) {
      try {
        await git.fetch("origin");
        await git.reset(["--hard", `origin/${defaultBranch}`]);
        // await git.clean(["-f", "-d"]);
      } catch (error) {
        console.error(`Error updating ${target.url}:`, error);
        throw error;
      }
    } else {
      console.error(`Directory ${repoPath} exists but is not a git repository.`);
    }
  } else {
    // The directory does not exist; create it and perform git clone
    try {
      fs.mkdirSync(repoPath, { recursive: true });
      const git: SimpleGit = simpleGit();
      await git.clone(target.url, repoPath);
    } catch (error) {
      console.error(`Error cloning ${target.url}:`, error);
      throw error;
    }
  }
}
