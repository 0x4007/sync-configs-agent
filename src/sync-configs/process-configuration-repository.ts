import * as fs from "fs";
import path from "path";
import { applyChanges } from "./apply-changes";
import { confirmChanges } from "./confirm-changes";
import { getDiff } from "./get-diff";
import { getModifiedContent } from "./get-modified-content";
import { STORAGE_DIR } from "./sync-configs";
import { Target } from "./targets";

export async function processConfigurationRepository(target: Target, instruction: string, parserCode: string, isInteractive: boolean) {
  const filePath = path.join(__dirname, STORAGE_DIR, target.localDir, target.filePath);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${target.url} as the file ${target.filePath} does not exist.`);
    return;
  }
  const fileContent = fs.readFileSync(filePath, "utf8");

  const modifiedContent = await getModifiedContent(fileContent, instruction, parserCode, target.url);

  const tempFilePath = `${filePath}.modified`;
  fs.writeFileSync(tempFilePath, modifiedContent, "utf8");

  const diff = await getDiff(filePath, tempFilePath);
  console.log(diff);

  const isConfirmed = !isInteractive || (await confirmChanges(target.url));

  if (isConfirmed) {
    await applyChanges({ target, filePath, modifiedContent, instruction, isInteractive });
  } else {
    console.log(`Changes to ${target.url} discarded.`);
  }
}
