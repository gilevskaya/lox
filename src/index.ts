import fs from "fs";
import readline from "readline";
import commander from "commander";

const program = new commander.Command();
program.version("0.0.1");

program.option("-f, --file <file>", "run program from the .lox file");
program.parse(process.argv);

// either running program from a file
if (program.file) {
  fs.readFile(program.file, (err, sourceBuff) => {
    if (err) throw err;
    run(sourceBuff.toString());
    process.exit(0);
  });
  // or from REPL
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });
  rl.prompt();
  rl.on("line", line => {
    run(line);
    rl.prompt();
  }).on("close", () => {
    process.exit(0);
  });
}

const run = (source: string) => {
  console.log("LOX running:", source);
};
