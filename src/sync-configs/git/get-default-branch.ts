import { git } from "./simple-git-init";
export async function getDefaultBranch(repoUrl: string): Promise<string> {
  try {
    const remoteInfo = await git.listRemote(["--symref", repoUrl, "HEAD"]);
    const match = remoteInfo.match(/ref: refs\/heads\/(\S+)\s+HEAD/);
    return match ? match[1] : "main";
  } catch (error) {
    console.error(`Error getting default branch for ${repoUrl}:`, error);
    return "main";
  }
}
