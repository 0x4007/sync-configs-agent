import simpleGit, { SimpleGit } from "simple-git";

export const git: SimpleGit = simpleGit();

const token = process.env.GITHUB_APP_TOKEN;
if (!token) {
  throw new Error("GITHUB_APP_TOKEN is not set");
}
git.env("GIT_ASKPASS", "echo");
git.env("GIT_USERNAME", "ubiquity-os[bot]");
git.env("GIT_PASSWORD", token);
