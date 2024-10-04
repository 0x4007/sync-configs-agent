import * as fs from "fs";
import * as path from "path";
import { cloneOrPullRepo } from "./clone-or-pull-repo";
import { getDefaultBranch } from "./get-default-branch";
import { pushModifiedContents } from "./push-modified-contents";
import { repositories } from "./repositories";
import { syncConfigsInteractive } from "./sync-configs-interactive";
import { syncConfigsNonInteractive } from "./sync-configs-non-interactive";

export type Repo = (typeof repositories)[number];

export const REPOS_DIR = "../organizations";

export async function syncConfigsAgent() {
  const args = process.argv.slice(2);
  const isInteractive = process.env.INTERACTIVE === "true";

  const reposPath = path.resolve(__dirname, REPOS_DIR);
  if (!fs.existsSync(reposPath)) {
    fs.mkdirSync(reposPath, { recursive: true });
  }

  const clonePromises = repositories.map(async (repo) => {
    const defaultBranch = await getDefaultBranch(repo.url);
    return cloneOrPullRepo(repo, defaultBranch);
  });

  await Promise.all(clonePromises);

  if (isInteractive) {
    await syncConfigsInteractive();
  } else {
    await syncConfigsNonInteractive();
  }

  // Push changes unless it's non-interactive mode
  if (isInteractive || args.includes("--push")) {
    await pushModifiedContents();
  }
}
