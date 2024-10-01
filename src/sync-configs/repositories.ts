import { CONFIG_FILE_PATH } from "./sync-configs";

export const repositories = [
  {
    url: "https://github.com/ubiquity/ubiquibot-config.git",
    filePath: CONFIG_FILE_PATH,
    localDir: "ubiquity",
  },
  {
    url: "https://github.com/ubiquity-os/ubiquibot-config.git",
    filePath: CONFIG_FILE_PATH,
    localDir: "ubiquity-os",
  },
  {
    url: "https://github.com/ubiquity-os-marketplace/ubiquibot-config.git",
    filePath: CONFIG_FILE_PATH,
    localDir: "ubiquity-os-marketplace",
  },
];
