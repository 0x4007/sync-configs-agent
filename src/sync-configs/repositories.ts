const CONFIG_FILE_PATH = ".github/.ubiquibot-config.yml";

export const repositories = [
  {
    // https://github.com/ubiquity-os/ubiquity-os-kernel/blob/development/src/github/types/plugin-configuration.ts
    url: "https://github.com/ubiquity-os/ubiquity-os-kernel.git",
    filePath: "src/github/types/plugin-configuration.ts",
    localDir: "ubiquity-os-kernel",
    type: "parser",
  },
  {
    url: "https://github.com/ubiquity/ubiquibot-config.git",
    filePath: CONFIG_FILE_PATH,
    localDir: "ubiquity",
    type: "config",
  },
  {
    url: "https://github.com/ubiquity-os/ubiquibot-config.git",
    filePath: CONFIG_FILE_PATH,
    localDir: "ubiquity-os",
    type: "config",
  },
  {
    url: "https://github.com/ubiquity-os-marketplace/ubiquibot-config.git",
    filePath: CONFIG_FILE_PATH,
    localDir: "ubiquity-os-marketplace",
    type: "config",
  },
];
