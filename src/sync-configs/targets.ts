const CONFIG_FILE_PATH = ".github/.ubiquity-os.config.yml";

export type Target = (typeof targets)[number];
export const targets = [
  {
    // https://github.com/ubiquity-os/ubiquity-os-kernel/blob/development/src/github/types/plugin-configuration.ts
    type: "parser",
    localDir: "ubiquity-os-kernel",
    url: "https://github.com/ubiquity-os/ubiquity-os-kernel.git",
    filePath: "src/github/types/plugin-configuration.ts",
  },
  {
    type: "config",
    localDir: "ubiquity",
    url: "https://github.com/ubiquity/ubiquity-os.config.git",
    filePath: CONFIG_FILE_PATH,
  },
  // {
  //   type: "config",
  //   localDir: "ubiquity-pay-ubq-fi",
  //   url: "https://github.com/ubiquity/pay.ubq.fi.git",
  //   filePath: CONFIG_FILE_PATH,
  // },
  // {
  //   type: "config",
  //   localDir: "ubiquity-work-ubq-fi",
  //   url: "https://github.com/ubiquity/work.ubq.fi.git",
  //   filePath: CONFIG_FILE_PATH,
  // },
  {
    type: "config",
    localDir: "ubiquity-os",
    url: "https://github.com/ubiquity-os/ubiquity-os.config.git",
    filePath: CONFIG_FILE_PATH,
  },
  {
    type: "config",
    localDir: "ubiquity-os-marketplace",
    url: "https://github.com/ubiquity-os-marketplace/ubiquity-os.config.git",
    filePath: CONFIG_FILE_PATH,
  },
];
