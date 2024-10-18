import * as fs from "fs";
import path from "path";
import { applyChanges } from "./apply-changes";
import { getDefaultBranch } from "./get-default-branch";
import { LAST_RUN_INSTRUCTION } from "./process-repositories";
import { STORAGE_DIR } from "./sync-configs";
import { targets } from "./targets";

export async function pushModifiedContents() {
  for (const repo of targets) {
    if (repo.type === "parser") {
      continue; // no changes to parser
    }
    const filePath = path.join(__dirname, STORAGE_DIR, repo.localDir, repo.filePath);
    const modifiedFilePath = `${filePath}.modified`;

    if (fs.existsSync(modifiedFilePath)) {
      const modifiedContent = fs.readFileSync(modifiedFilePath, "utf8");
      const defaultBranch = await getDefaultBranch(repo.url);
      await applyChanges({
        target: repo,
        filePath,
        modifiedContent,
        instruction: fs.readFileSync(path.join(__dirname, STORAGE_DIR, [`Rerunning using \`--push\` flag.`, LAST_RUN_INSTRUCTION].join("\n\n")), "utf8"),
        isInteractive: false,
        forceBranch: defaultBranch,
      });
    } else {
      console.log(`No modified file found for ${repo.url}. Skipping.`);
    }
  }
}
