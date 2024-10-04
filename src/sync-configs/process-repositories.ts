import path from "path";
import { processRepository } from "./process-repository";
import { repositories } from "./repositories";
import { REPOS_DIR } from "./sync-configs";
import * as fs from "fs";

export async function processRepositories(instruction: string, isInteractive: boolean) {
  const parserRepoIndex = repositories.findIndex((repo) => repo.type === "parser");
  if (parserRepoIndex === -1) {
    console.error("Parser repository not found. Unable to proceed.");
    return;
  }
  const [parserRepo] = repositories.splice(parserRepoIndex, 1);

  const parserFilePath = path.join(__dirname, REPOS_DIR, parserRepo.localDir, parserRepo.filePath);
  if (!fs.existsSync(parserFilePath)) {
    console.error(`Parser file ${parserFilePath} does not exist. Unable to proceed.`);
    return;
  }
  const parserCode = fs.readFileSync(parserFilePath, "utf8");

  for (const repo of repositories) {
    if (repo.type !== "parser") {
      await processRepository(repo, instruction, parserCode, isInteractive);
    }
  }
}
