import * as fs from "fs";
import * as path from "path";
import { cloneOrPullRepo } from "./clone-or-pull-repo";
import { getDefaultBranch } from "./get-default-branch";
import { pushModifiedContents } from "./push-modified-contents";
import { syncConfigsInteractive } from "./sync-configs-interactive";
import { syncConfigsNonInteractive } from "./sync-configs-non-interactive";
import { targets } from "./targets";

export const STORAGE_DIR = "../fixtures";

export async function syncConfigsAgent() {
  const args = process.argv.slice(2);
  const shouldPush = args.includes("--push");

  if (shouldPush) {
    await pushModifiedContents();
    return;
  }

  const reposPath = path.resolve(__dirname, STORAGE_DIR);
  if (!fs.existsSync(reposPath)) {
    fs.mkdirSync(reposPath, { recursive: true });
  }

  const clonePromises = targets.map(async (repo) => {
    const defaultBranch = await getDefaultBranch(repo.url);
    return cloneOrPullRepo(repo, defaultBranch);
  });

  await Promise.all(clonePromises);

  if (!process.env.INTERACTIVE || process.env.INTERACTIVE === "true") {
    await syncConfigsInteractive();
  } else if (process.env.INTERACTIVE === "false") {
    await syncConfigsNonInteractive();
  } else {
    throw new Error("Invalid value for INTERACTIVE environment variable.");
  }
}
