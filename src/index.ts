import chalk from "chalk";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { add, divide, multiply, subtract } from "./calulator.js";
import { readFromLogFile, writeToLogFile } from "./utils/index.js";

// Create interface
const rl = createInterface({
  input: stdin,
  output: stdout,
});
const logData: string[] = [];

// Entrypoint
async function main() {
  try {
    // Getting user input
    console.log(chalk.blue("=== Getting User Input ==="));
    const firstNumber = parseInt(
      await rl.question(chalk.blue("Enter first number: ")),
    );
    const secondNumber = parseInt(
      await rl.question(chalk.blue("Enter second number: ")),
    );

    // Validate input
    if (isNaN(firstNumber) || isNaN(secondNumber)) {
      throw new Error("Please enter valid numbers");
    }

    // Operations
    const sum = add(firstNumber, secondNumber);
    const difference = subtract(firstNumber, secondNumber);
    const product = multiply(firstNumber, secondNumber);
    const quotient = divide(firstNumber, secondNumber).toPrecision(2);

    // Printing results
    console.log(chalk.green("\n=== Printing Results ==="));
    console.log(chalk.green(`The sum is ${sum}`));
    console.log(chalk.green(`The difference is ${difference}`));
    console.log(chalk.green(`The product is ${product}`));
    console.log(chalk.green(`The quotient is ${quotient}`));

    // Adding data to log data
    const data = [
      `Enter first number: ${firstNumber}`,
      `Enter second number: ${secondNumber}`,
      `The sum is ${sum}`,
      `The difference is ${difference}`,
      `The product is ${product}`,
      `The quotient is ${quotient}`,
    ];
    logData.push(...data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(chalk.red("\n=== Error ==="));
      console.log(chalk.red(error.message));
      logData.push(error.message);
    }
  } finally {
    rl.close();

    // Writing data to log file
    const fileURL = await writeToLogFile(logData.join("\n"));

    // Printing log data
    const data = await readFromLogFile(fileURL ?? "");

    if (data) {
      console.log(chalk.magenta("\n=== Printing Log Data ==="));
      console.log(chalk.magenta(await readFromLogFile(fileURL ?? "")));
    }
  }
}

main();
