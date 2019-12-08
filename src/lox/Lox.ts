// http://craftinginterpreters.com/scanning.html

import fs from "fs";
import readline from "readline";
import chalk from "chalk";

import * as lox from ".";

export class Lox {
  private static hadError = false;

  constructor(file: string | undefined) {
    if (file) Lox.runFile(file);
    else Lox.runPropmt();
  }

  private static runFile(file: string) {
    fs.readFile(file, (err, sourceBuff) => {
      if (err) throw err;
      Lox.run(sourceBuff.toString());
      process.exit(0);
    });
  }

  private static runPropmt() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> "
    });
    rl.prompt();
    rl.on("line", line => {
      Lox.run(line);
      // We need to reset this flag in the interactive loop.
      // If the user makes a mistake, it shouldn’t kill their entire session:
      Lox.hadError = false;
      rl.prompt();
    }).on("close", () => {
      process.exit(0);
    });
  }

  private static run(source: string) {
    // Indicate an error in the exit code.
    if (Lox.hadError) process.exit(1);

    const scanner = new lox.Scanner(source);
    const tokens: lox.Token[] = scanner.scanTokens();
    console.log("Parsed tokens:");
    tokens.forEach(t => console.log(`:: ${t}`));
    const parser: lox.Parser = new lox.Parser(tokens);
    const expression = parser.parse();
    console.log("expression", expression);
    // Stop if there was a syntax error.
    if (this.hadError || expression == null) return;
    console.log(new lox.AstPrinter().print(expression));
  }

  public static error(info: number | lox.Token, message: string) {
    // info is a line number
    if (typeof info === "number") {
      Lox.report(info, "", message);
      // info is a Token
    } else if (info.token.type == lox.TokenType.EOF) {
      Lox.report(info.token.line, " at end", message);
    } else {
      Lox.report(info.token.line, " at '" + info.token.lexeme + "'", message);
    }
  }

  private static report(line: number, where: string, message: string) {
    console.error(chalk.red(`[line ${line}] Error ${where}: ${message}`));
    Lox.hadError = true;
  }
}
