import * as path from "node:path";
import * as readline from "node:readline";
import { homedir } from "node:os";
import { fileURLToPath } from "url";
import { Worker } from "node:worker_threads";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const arg = process.argv[2].split("=");

const usernamefolder = function () {
  const array = homedir().split(path.sep);
  array.splice(array.length - 1, 1, arg[1]);
  return array.join("\\");
};

let workingFolder = usernamefolder();

if (arg.includes("--username")) {
  console.log(`Welcome to the File Manager, ${arg[1]}!`);
  console.log(`You are currently in ${usernamefolder()}`);
}

const prompt = arg[1];

async function ask(question) {
  try {
    rl.question(question, (answer) => {
      if (answer === ".exit") {
        process.exit();
      } else if (answer === "up") {
        if (workingFolder !== `${process.env.SystemDrive}\\`) {
          const workerOnUp = new Worker("./navigation.js");
          workerOnUp.postMessage(workingFolder);
          workerOnUp.on("message", (value) => {
            workingFolder = value;
            workerOnUp.terminate();
            console.log(`You are currently in ${value}`);
            ask(question);
          });
        } else {
          console.log(`You are currently in ${workingFolder}`);
          ask(question);
        }
      } else if (answer.split(" ")[0] === "cd") {
        console.log(`You are currently in ${answer.split(" ")[1]}`);
        workingFolder = answer.split(" ")[1];
        ask(question);
      } else if (answer === "ls") {
        const pathToDirectory = path.relative(__dirname, `${workingFolder}`);
        const workerOnLs = new Worker("./operationfail.js");
        workerOnLs.postMessage(pathToDirectory);
        workerOnLs.on("message", (value) => {
          workerOnLs.terminate();
          console.table(value);
          ask(question);
        });
      } else {
        console.log(`You are currently in ${workingFolder}`);
        ask(question);
      }
    });
  } catch (err) {
    throw err;
  }
}

process.on("exit", () => {
  console.log(`\nThank you for using File Manager, ${prompt}, goodbye!`);
});

await ask(`${prompt}> `);
