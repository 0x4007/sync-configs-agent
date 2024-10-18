import { Octokit } from "@octokit/rest";
import { Target } from "./targets";

export async function createPullRequest({
  target,
  branchName,
  defaultBranch,
  instruction,
}: {
  target: Target;
  branchName: string;
  defaultBranch: string;
  instruction: string;
}) {
  const octokit = new Octokit({ auth: process.env.GITHUB_APP_TOKEN });

  console.log(`Attempting to create PR for owner: ${target.owner}, repo: ${target.repo}`);
  console.log(`Branch: ${branchName}, Base: ${defaultBranch}`);

  try {
    const response = await octokit.pulls.create({
      owner: target.owner,
      repo: target.repo,
      title: `Update configuration: ${instruction.split("\n")[0]}`,
      head: branchName,
      base: defaultBranch,
      body: `This pull request updates the configuration based on the following instruction:\n\n${instruction}`,
    });

    console.log(`Pull request created: ${response.data.html_url}`);
    return response.data.html_url;
  } catch (error) {
    console.error("Error creating pull request:", error);
    console.error("Request details:", {
      owner: target.owner,
      repo: target.repo,
      head: branchName,
      base: defaultBranch,
    });
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    console.warn("You may need to create the pull request manually.");
    return null;
  }
}
