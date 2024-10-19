import simpleGit, { SimpleGit } from "simple-git";

const token = process.env.GITHUB_APP_TOKEN;
if (!token) {
  throw new Error("GITHUB_APP_TOKEN is not set");
}

export async function getSimpleGit() {
  const git: SimpleGit = simpleGit();
  return git;
}
