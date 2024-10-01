import { exec } from "child_process";
import chalk from "chalk";

export async function getDiff(originalFile: string, modifiedFile: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`diff -u ${originalFile} ${modifiedFile}`, (error, stdout, stderr) => {
      if (error && error.code !== 1) {
        reject(stderr);
      } else {
        const coloredDiff = stdout
          .split("\n")
          .map((line) => {
            if (line.startsWith("+")) {
              return chalk.green(line);
            } else if (line.startsWith("-")) {
              return chalk.red(line);
            } else if (line.startsWith("@")) {
              return chalk.cyan(line);
            }
            return line;
          })
          .join("\n");
        resolve(coloredDiff || stderr);
      }
    });
  });
}
