import { parentPort } from "node:worker_threads";
import { ChildProcess } from "node:child_process";

parentPort.on("message", (value) => {
  async function newPath(oldPath) {
    const array = oldPath.slice(0, -1).split("\\");
    array.splice(array.length - 1, 1);
    return array.join("\\").concat("\\");
  }

  async function sendResult() {
    parentPort.postMessage(await newPath(value));
  }

  sendResult();
});
