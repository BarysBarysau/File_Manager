import { parentPort } from "node:worker_threads";
import * as path from "node:path";
import { opendir } from "node:fs/promises";

parentPort.on("message", (value) => {
  switch (value[0]) {
    case "up":
      function newPath(oldPath) {
        const array = oldPath.slice(0, -1).split(path.sep);
        array.splice(array.length - 1, 1);
        return array.join(path.sep).concat(path.sep);
      }
      async function sendResultUp() {
        parentPort.postMessage(newPath(value[1]));
      }
      sendResultUp();
      break;

    case "ls":
      const list = async (path) => {
        let array = [];
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
      };

      async function sendResultLs() {
        parentPort.postMessage(await list(value[1]));
      }

      sendResultLs();
      break;

    case "cd":
      opendir(`${value[1]}`).then((dir) =>
        dir
          .close()
          .then(() => parentPort.postMessage("Directory has been changed"))
      );
      break;
  }
});
