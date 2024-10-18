import * as path from "path";
const CONFIG_FILE_PATH = ".github/.ubiquity-os.config.yml";

const parserTarget = {
  type: "parser",
  url: "https://github.com/ubiquity-os/ubiquity-os-kernel.git",
};

const userArgs = process.argv.slice(2);

let targetUrls;

if (userArgs.length > 0) {
  // User has provided URLs via CLI arguments
  targetUrls = userArgs.map((url) => ({ type: "config", url }));
} else {
  // Use default configs
  targetUrls = [
    { type: "config", url: "https://github.com/ubiquity/ubiquity-os.config.git" },
    { type: "config", url: "https://github.com/ubiquity-os/ubiquity-os.config.git" },
    { type: "config", url: "https://github.com/ubiquity-os-marketplace/ubiquity-os.config.git" },
  ];
}

// Always include the parser target
targetUrls.unshift(parserTarget);

export const targets: Target[] = targetUrls.map(({ type, url }) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)(\.git)?$/);
  if (!match) {
    throw new Error(`Invalid GitHub URL: ${url}`);
  }

  const owner = match[1];
  const repo = match[2].replace(".git", "");
  const isKernel = type === "parser";

  return {
    type,
    owner,
    repo,
    localDir: path.join(owner, repo),
    url,
    filePath: isKernel ? "src/github/types/plugin-configuration.ts" : CONFIG_FILE_PATH,
  };
});

export type Target = {
  type: string;
  owner: string;
  repo: string;
  localDir: string;
  url: string;
  filePath: string;
};
