import * as fs from "fs";
import path from "path";
import { processRepository } from "./process-repository";
import { repositories } from "./repositories";
import { REPOS_DIR } from "./sync-configs";

export const LAST_RUN_INSTRUCTION = "last-run-instruction.txt";

export async function processRepositories(instruction: string, isInteractive: boolean) {
  const instructionFilePath = path.join(__dirname, REPOS_DIR, LAST_RUN_INSTRUCTION);
  fs.writeFileSync(instructionFilePath, instruction, "utf8");

  const parserRepoIndex = repositories.findIndex((repo) => repo.type === "parser");
  if (parserRepoIndex === -1) {
    throw new Error("Parser repository not found. Unable to proceed.");
  }
  const [parserRepo] = repositories.splice(parserRepoIndex, 1);

  const parserFilePath = path.join(__dirname, REPOS_DIR, parserRepo.localDir, parserRepo.filePath);
  if (!fs.existsSync(parserFilePath)) {
    throw new Error(`Parser file ${parserFilePath} does not exist. Unable to proceed.`);
  }
  const parserCode = fs.readFileSync(parserFilePath, "utf8");

  for (const repo of repositories) {
    if (repo.type !== "parser") {
      await processRepository(repo, instruction, parserCode, isInteractive);
    }
  }
}
