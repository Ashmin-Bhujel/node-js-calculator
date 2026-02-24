import chalk from "chalk";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { add, divide, multiply, subtract } from "./calulator.js";
import { readFromLogFile, writeToLogFile } from "./utils.js";

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
    const firstNumber = await rl.question(chalk.blue("Enter first number: "));
    const secondNumber = await rl.question(chalk.blue("Enter second number: "));
    logData.push(
      ...[
        `Enter first number: ${firstNumber}`,
        `Enter second number: ${secondNumber}`,
      ],
    );

    // Parse user input to integer
    const parsedFirstNumber = parseInt(firstNumber);
    const parsedSecondNumber = parseInt(secondNumber);

    // Validate input
    if (isNaN(parsedFirstNumber) || isNaN(parsedSecondNumber)) {
      throw new Error("Please enter valid numbers");
    }

    // Operations
    const sum = add(parsedFirstNumber, parsedSecondNumber);
    const difference = subtract(parsedFirstNumber, parsedSecondNumber);
    const product = multiply(parsedFirstNumber, parsedSecondNumber);
    const quotient = divide(parsedFirstNumber, parsedSecondNumber).toPrecision(
      2,
    );

    // Printing results
    console.log(chalk.green("\n=== Printing Results ==="));
    console.log(chalk.green(`The sum is ${sum}`));
    console.log(chalk.green(`The difference is ${difference}`));
    console.log(chalk.green(`The product is ${product}`));
    console.log(chalk.green(`The quotient is ${quotient}`));
    logData.push(
      ...[
        `The sum is ${sum}`,
        `The difference is ${difference}`,
        `The product is ${product}`,
        `The quotient is ${quotient}`,
      ],
    );
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
