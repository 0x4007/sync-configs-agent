import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { REPOS_DIR } from "./sync-configs";
import * as fs from "fs";

export function cloneOrPullRepo(repo: { url: string; localDir: string }, defaultBranch: string): Promise<void> {
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
