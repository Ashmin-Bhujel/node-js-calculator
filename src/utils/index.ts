import chalk from "chalk";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Pathname and dirname
const __pathname = fileURLToPath(import.meta.url);
const __dirname = dirname(__pathname);
const logsDirectoryPath = join(__dirname, "./../../logs");

// Write to log file function
export async function writeToLogFile(logData: string) {
  try {
    // Get current ISO date and time
    const currentTime = new Date().toISOString().replace(/[:.]+/g, "-");

    // Make logs directory if not exists
    await mkdir(logsDirectoryPath, { recursive: true });

    // Write data to log files
    const fileURL = join(logsDirectoryPath, `log-${currentTime}.log`);
    await writeFile(fileURL, logData, "utf-8");
    await writeFile(
      join(logsDirectoryPath, "log-latest.log"),
      logData,
      "utf-8",
    );

    return fileURL;
  } catch (error) {
    if (error instanceof Error) {
      console.log(chalk.red("\n=== File Write Error ==="));
      console.log(chalk.red("Failed to write to log file\n", error.message));
    }

    return undefined;
  }
}

// Read from log file function
export async function readFromLogFile(fileUrl: string) {
  try {
    const logData = await readFile(fileUrl, "utf-8");

    if (!logData) {
      throw new Error("Empty log file");
    }

    return logData;
  } catch (error) {
    if (error instanceof Error) {
      console.log(chalk.red("\n=== File Read Error ==="));
      console.log(
        chalk.red("Failed to read data from log file\n", error.message),
      );
    }

    return undefined;
  }
}
