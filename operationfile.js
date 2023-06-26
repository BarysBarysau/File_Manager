import { parentPort } from "node:worker_threads";
import * as path from "node:path";
import { finished } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { rename, open } from "node:fs/promises";

parentPort.on("message", (value) => {
  switch (value[0]) {
    case "cat":
      const read = async () => {
        const rs = createReadStream(value[1], { encoding: "utf8" });
        rs.on("data", (data) => {
          parentPort.postMessage(data);
        });
        await finished(rs);
      };
      read();
      break;
    case "add":
      open(value[1], "wx").then(() => parentPort.postMessage("File created"));
      break;
    case "rn":
      rename(value[1], value[2]).then(() =>
        parentPort.postMessage("File renamed")
      );
      break;
    case "cp":
      pipeline(createReadStream(value[1]), createWriteStream(value[2])).then(
        () => parentPort.postMessage("File copyed")
      );
      break;
    case "mv":
      break;
    case "rm":
      break;
  }
});
