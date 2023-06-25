import { parentPort } from "node:worker_threads";
import * as path from "node:path";

parentPort.on("message", (value) => {
  async function newPath(oldPath) {
    const array = oldPath.slice(0, -1).split(path.sep);
    array.splice(array.length - 1, 1);
    return array.join(path.sep).concat(path.sep);
  }

  async function sendResult() {
    parentPort.postMessage(await newPath(value));
  }

  sendResult();
});
