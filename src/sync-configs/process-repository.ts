import * as fs from "fs";
import path from "path";
import { applyChanges } from "./apply-changes";
import { confirmChanges } from "./confirm-changes";
import { getDiff } from "./get-diff";
import { getModifiedContent } from "./get-modified-content";
import { Repo, REPOS_DIR } from "./sync-configs";

export async function processRepository(repo: Repo, instruction: string, parserCode: string, isInteractive: boolean) {
  const filePath = path.join(__dirname, REPOS_DIR, repo.localDir, repo.filePath);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${repo.url} as the file ${repo.filePath} does not exist.`);
    return;
  }
  const fileContent = fs.readFileSync(filePath, "utf8");

  const modifiedContent = await getModifiedContent(fileContent, instruction, parserCode);

  const tempFilePath = `${filePath}.modified`;
  fs.writeFileSync(tempFilePath, modifiedContent, "utf8");

  const diff = await getDiff(filePath, tempFilePath);
  console.log(diff);

  const isConfirmed = !isInteractive || (await confirmChanges(repo.url));

  if (isConfirmed) {
    await applyChanges({ repo, filePath, modifiedContent, instruction, isInteractive });
  } else {
    console.log(`Changes to ${repo.url} discarded.`);
  }
}
