import * as fs from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { REPOS_DIR } from "./sync-configs";

const UBIQUITY_OS_USERNAME = "ubiquity-os[bot]";
const UBIQUITY_OS_EMAIL = "ubiquity-os[bot]@users.noreply.github.com";
const USER_NAME = "user.name";
const USER_EMAIL = "user.email";

export function cloneOrPullRepo(repo: { url: string; localDir: string }, defaultBranch: string): Promise<void> {
  const repoDir = path.resolve(__dirname, REPOS_DIR, repo.localDir);
  const git: SimpleGit = simpleGit();

  // Use GITHUB_TOKEN from environment variables
  const authToken = process.env.GITHUB_TOKEN;
  if (!authToken) {
    return Promise.reject(new Error("GITHUB_TOKEN is not set"));
  }

  // Construct the authenticated URL
  const authUrl = repo.url.replace("https://", `https://x-access-token:${authToken}@`);

  return new Promise((resolve, reject) => {
    if (fs.existsSync(repoDir)) {
      // Repo already cloned, do git pull
      git
        .cwd(repoDir)
        .then(() => git.addConfig(USER_NAME, UBIQUITY_OS_USERNAME))
        .then(() => git.addConfig(USER_EMAIL, UBIQUITY_OS_EMAIL))
        .then(() => Promise.all([git.checkout(defaultBranch), git.pull(authUrl, defaultBranch)]))
        .then(() => resolve())
        .catch(reject);
    } else {
      // Clone the repo
      console.log(`Cloning ${repo.url}`);
      git
        .clone(authUrl, repoDir)
        .then(() => git.cwd(repoDir))
        .then(() => git.addConfig(USER_NAME, UBIQUITY_OS_USERNAME))
        .then(() => git.addConfig(USER_EMAIL, UBIQUITY_OS_EMAIL))
        .then(() => git.checkout(defaultBranch))
        .then(() => resolve())
        .catch((error) => {
          if (error instanceof Error && error.message.includes("destination path already exists")) {
            console.log(`The directory ${repo.localDir} already exists. Pulling instead.`);
            git
              .cwd(repoDir)
              .then(() => git.addConfig(USER_NAME, UBIQUITY_OS_USERNAME))
              .then(() => git.addConfig(USER_EMAIL, UBIQUITY_OS_EMAIL))
              .then(() => Promise.all([git.checkout(defaultBranch), git.pull(authUrl, defaultBranch)]))
              .then(() => resolve())
              .catch(reject);
          } else {
            reject(error);
          }
        });
    }
  });
}
