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
targetUrls.push(parserTarget);

export const targets: Target[] = targetUrls.map(({ type, url }) => {
  const [, , repo] = url.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
  const isKernel = type === "parser";

  return {
    type,
    localDir: repo.replace(".git", ""),
    url,
    filePath: isKernel ? "src/github/types/plugin-configuration.ts" : CONFIG_FILE_PATH,
  };
});

export type Target = {
  type: string;
  localDir: string;
  url: string;
  filePath: string;
};
