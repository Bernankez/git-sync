import chalk from "chalk";

export const log = {
  message: (msg: string) => {
    console.log(chalk.whiteBright("> ") + msg);
  },
  info: (msg: string) => {
    console.log(chalk.blueBright("i ") + msg);
  },
  error: (msg: string) => {
    console.log(chalk.redBright("✖ ") + msg);
  },
  success: (msg: string) => {
    console.log(chalk.greenBright("✔ ") + msg);
  },
};
