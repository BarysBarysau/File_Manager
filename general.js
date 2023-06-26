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
  console.log(`You are currently in ${workingFolder}`);
}

const prompt = arg[1];

async function ask(question) {
  try {
    rl.question(question, (answer) => {
      if (answer === ".exit") {
        process.exit();
      } else if (answer === "up") {
        if (workingFolder !== `${process.env.SystemDrive.concat(path.sep)}`) {
          const workerOnNaw = new Worker("./navigation.js");
          workerOnNaw.postMessage([answer, workingFolder]);
          workerOnNaw.on("message", (value) => {
            workingFolder = value;
            workerOnNaw.terminate();
            console.log(`You are currently in ${value}`);
            ask(question);
          });
          workerOnNaw.on("error", (error) => {
            console.log(error);
            ask(question);
          });
        } else {
          console.log(`You are currently in ${workingFolder}`);
          ask(question);
        }
      } else if (answer.split(" ")[0] === "cd") {
        if (answer.split(" ")[1] === `${process.env.SystemDrive}`) {
          console.log(
            `You are currently in ${answer.split(" ")[1].concat(path.sep)}`
          );
          workingFolder = answer.split(" ")[1].concat(path.sep);
          ask(question);
        } else {
          const workerOnNaw = new Worker("./navigation.js");
          workerOnNaw.postMessage([answer.split(" ")[0], answer.split(" ")[1]]);
          workerOnNaw.on("message", (value) => {
            console.log(value);
            workerOnNaw.terminate();
            console.log(`You are currently in ${answer.split(" ")[1]}`);
            workingFolder = answer.split(" ")[1];
            ask(question);
          });
          workerOnNaw.on("error", (error) => {
            console.error(error, { message: "Operation failed" });
            ask(question);
          });
        }
      } else if (answer === "ls") {
        const pathToDirectory = path.resolve(__dirname, `${workingFolder}`);
        const workerOnLs = new Worker("./navigation.js");
        workerOnLs.postMessage([answer, pathToDirectory]);
        workerOnLs.on("message", (value) => {
          console.table(value);
          workerOnLs.terminate();
          ask(question);
        });
        workerOnLs.on("error", (error) => {
          console.error(error, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "cat") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const workerOnFs = new Worker("./operationfile.js");
        workerOnFs.postMessage([answer.split(" ")[0], pathToFile]);
        workerOnFs.on("message", (value) => {
          process.stdout.write(value);
          workerOnFs.terminate();
          ask(question);
        });
        workerOnFs.on("error", (error) => {
          console.error(error, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "add") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const workerOnFs = new Worker("./operationfile.js");
        workerOnFs.postMessage([answer.split(" ")[0], pathToFile]);
        workerOnFs.on("message", (value) => {
          console.log(value);
          workerOnFs.terminate();
          ask(question);
        });
        workerOnFs.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "rn") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const newPathToFile = path.resolve(
          __dirname,
          `${answer.split(" ")[2]}`
        );
        const workerOnFs = new Worker("./operationfile.js");
        workerOnFs.postMessage([
          answer.split(" ")[0],
          pathToFile,
          newPathToFile,
        ]);
        workerOnFs.on("message", (value) => {
          console.log(value);
          workerOnFs.terminate();
          ask(question);
        });
        workerOnFs.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "cp") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const newPathToFile = path.resolve(
          __dirname,
          `${answer.split(" ")[2]}`
        );
        const workerOnFs = new Worker("./operationfile.js");
        workerOnFs.postMessage([
          answer.split(" ")[0],
          pathToFile,
          newPathToFile,
        ]);
        workerOnFs.on("message", (value) => {
          console.log(value);
          workerOnFs.terminate();
          ask(question);
        });
        workerOnFs.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "mv") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const newPathToFile = path.resolve(
          __dirname,
          `${answer.split(" ")[2]}`
        );
        const workerOnFs = new Worker("./operationfile.js");
        workerOnFs.postMessage([
          answer.split(" ")[0],
          pathToFile,
          newPathToFile,
        ]);
        workerOnFs.on("message", (value) => {
          console.log(value);
          workerOnFs.terminate();
          ask(question);
        });
        workerOnFs.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "rm") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const workerOnFs = new Worker("./operationfile.js");
        workerOnFs.postMessage([answer.split(" ")[0], pathToFile]);
        workerOnFs.on("message", (value) => {
          console.log(value);
          workerOnFs.terminate();
          ask(question);
        });
        workerOnFs.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "hash") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const workerOnHash = new Worker("./hash.js");
        workerOnHash.postMessage(pathToFile);
        workerOnHash.on("message", (value) => {
          console.log(value);
          workerOnHash.terminate();
          ask(question);
        });
        workerOnHash.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "compress") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const pathToCompress = path.resolve(
          __dirname,
          `${answer.split(" ")[2]}`
        );
        const workerOnCompress = new Worker("./compress.js");
        workerOnCompress.postMessage([
          answer.split(" ")[0],
          pathToFile,
          pathToCompress,
        ]);
        workerOnCompress.on("message", (value) => {
          console.log(value);
          workerOnCompress.terminate();
          ask(question);
        });
        workerOnCompress.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else if (answer.split(" ")[0] === "decompress") {
        const pathToFile = path.resolve(__dirname, `${answer.split(" ")[1]}`);
        const pathToDecompress = path.resolve(
          __dirname,
          `${answer.split(" ")[2]}`
        );
        const workerOnCompress = new Worker("./compress.js");
        workerOnCompress.postMessage([
          answer.split(" ")[0],
          pathToFile,
          pathToDecompress,
        ]);
        workerOnCompress.on("message", (value) => {
          console.log(value);
          workerOnCompress.terminate();
          ask(question);
        });
        workerOnCompress.on("error", (err) => {
          console.error(err, { message: "Operation failed" });
          ask(question);
        });
      } else {
        console.log("Invalid input");
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
