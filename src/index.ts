import fs from 'fs';
import commander from 'commander';

const program = new commander.Command();
program.version('0.0.1');

program.option('-f, --file <file>', 'run program from the .lox file');
program.parse(process.argv);

if (program.file) {
  console.log(`parsing ${program.file}`);
  fs.readFile(program.file, (err, data) => {
    if (err) throw err;
    const codeLines = data.toString().split('\n');
    console.log('lox code:', codeLines);
  });
} else {
  console.log('command promt...');
}
