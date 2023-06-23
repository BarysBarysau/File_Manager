import * as path from "node:path";
import * as readline from "node:readline";
import { fileURLToPath } from "url";
import { homedir } from "node:os";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const arg = process.argv[2].split("=");

const usernamefolder = function () {
  const array = homedir().split("\\");
  array.splice(array.length - 1, 1, arg[1]);
  return array.join("\\");
};

if (arg.includes("--username")) {
  console.log(`Welcome to the File Manager, ${arg[1]}!`);
  console.log(`You are currently in ${usernamefolder()}`);
}

const prompt = arg[1];

function ask(question) {
  rl.question(question, (answer) => {
    if (answer === ".exit") {
      process.exit();
    }
    console.log(`You are currently in ${usernamefolder()}`);
    ask(question);
  });
}

process.on("exit", () => {
  console.log(`\nThank you for using File Manager, ${prompt}, goodbye!`);
});

ask(`${prompt}> `);

/* const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */
