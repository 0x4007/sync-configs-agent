import { Octokit } from "@octokit/rest";
import { Target } from "./sync-configs";

export async function createPullRequest({
  repo,
  branchName,
  defaultBranch,
  instruction,
}: {
  repo: Target;
  branchName: string;
  defaultBranch: string;
  instruction: string;
}) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repoName] = repo.url.split("/").slice(-2);

  const cleanRepoName = repoName.replace(/\.git$/, "");

  try {
    const { data: pullRequest } = await octokit.pulls.create({
      owner,
      repo: cleanRepoName,
      title: `Sync configs: ${instruction}`,
      head: branchName,
      base: defaultBranch,
      body: `> [!NOTE]
> This pull request was automatically created by the @UbiquityOS Sync Configurations Agent.
>
> ${instruction}`,
    });

    console.log(`Pull request created: ${pullRequest.html_url}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to create pull request: ${error.message}`);
    } else {
      console.error("Failed to create pull request: Unknown error");
    }
  }
}
