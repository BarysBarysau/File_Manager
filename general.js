import * as path from "node:path";
import * as readline from "node:readline";
import { fileURLToPath } from "url";
import { homedir } from "node:os";
import { Worker } from "node:worker_threads";

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
      }
      if (answer === "up") {
        if (workingFolder !== "C:\\") {
          const workerOnUp = new Worker("./navigation.js");
          workerOnUp.postMessage(workingFolder);
          workerOnUp.on("message", (value) => {
            workingFolder = value;
            console.log(`You are currently in ${workingFolder}`);
            ask(question);
          });
        } else {
          console.log(`You are currently in ${workingFolder}`);
          ask(question);
        }
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

/* const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */
