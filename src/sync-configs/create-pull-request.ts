import { Octokit } from "@octokit/rest";

export async function createPullRequest({
  target,
  branchName,
  defaultBranch,
  instruction,
}: {
  target: { url: string };
  branchName: string;
  defaultBranch: string;
  instruction: string;
}) {
  const octokit = new Octokit({ auth: process.env.GITHUB_APP_TOKEN });

  // Extract owner and repo from the target URL
  const [, owner, repo] = target.url.match(/github\.com\/([^/]+)\/([^/.]+)/) || [];

  if (!owner || !repo) {
    throw new Error(`Invalid GitHub URL: ${target.url}`);
  }

  console.log(`Attempting to create PR for owner: ${owner}, repo: ${repo}`);
  console.log(`Branch: ${branchName}, Base: ${defaultBranch}`);

  try {
    const response = await octokit.pulls.create({
      owner,
      repo,
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
      owner,
      repo,
      head: branchName,
      base: defaultBranch,
    });
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}
