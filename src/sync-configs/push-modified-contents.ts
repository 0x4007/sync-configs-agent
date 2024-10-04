import * as fs from "fs";
import path from "path";
import { applyChanges } from "./apply-changes";
import { getDefaultBranch } from "./get-default-branch";
import { repositories } from "./repositories";
import { REPOS_DIR } from "./sync-configs";

export async function pushModifiedContents() {
  for (const repo of repositories) {
    if (repo.type === "parser") {
      continue; // no changes to parser
    }
    const filePath = path.join(__dirname, REPOS_DIR, repo.localDir, repo.filePath);
    const modifiedFilePath = `${filePath}.modified`;

    if (fs.existsSync(modifiedFilePath)) {
      const modifiedContent = fs.readFileSync(modifiedFilePath, "utf8");
      const defaultBranch = await getDefaultBranch(repo.url);
      await applyChanges({
        repo,
        filePath,
        modifiedContent,
        instruction: "Rerunning using `--push` flag. Original prompt has not been retained.",
        isInteractive: false,
        forceBranch: defaultBranch,
      });
    } else {
      console.log(`No modified file found for ${repo.url}. Skipping.`);
    }
  }
}
