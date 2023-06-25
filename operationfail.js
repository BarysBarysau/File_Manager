import { parentPort } from "node:worker_threads";
import { opendir } from "node:fs/promises";

parentPort.on("message", (value) => {
  const list = async (path) => {
    let array = [];
    try {
      const dir = await opendir(path);
      for await (const dirent of dir) {
        if (dirent.isFile()) {
          array.push({ Name: dirent.name, Type: "file" });
        } else if (dirent.isDirectory()) {
          array.push({ Name: dirent.name, Type: "directory" });
        }
      }
      return array.sort((a, b) => {
        if ((a.Type === "file", b.Type === "directory")) {
          return 1;
        } else if ((a.Type === "directory", b.Type === "file")) {
          return -1;
        }
        return 0;
      });
    } catch (err) {
      throw err;
    }
  };

  async function sendResult() {
    parentPort.postMessage(await list(value));
  }

  sendResult();
});
