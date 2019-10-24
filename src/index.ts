import commander from "commander";

import { Lox } from "./lox";

const program = new commander.Command();
program.version("0.0.1");

program.option("-f, --file <file>", "run program from the .lox file");
program.parse(process.argv);

new Lox(program.file);
