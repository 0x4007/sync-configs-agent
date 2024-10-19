import simpleGit, { SimpleGit } from "simple-git";

const token = process.env.GITHUB_APP_TOKEN;
if (!token) {
  throw new Error("GITHUB_APP_TOKEN is not set");
}

export async function getSimpleGit() {
  const git: SimpleGit = simpleGit();
  await git.addConfig("user.name", "ubiquity-os[bot]");
  await git.addConfig("user.email", "ubiquity-os[bot]@users.noreply.github.com");
  await git.addConfig("http.extraheader", `AUTHORIZATION: bearer ${token}`);
  return git;
}
