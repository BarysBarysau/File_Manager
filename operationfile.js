import { parentPort } from "node:worker_threads";
import { opendir } from "node:fs/promises";
import * as path from "node:path";
import { finished } from "node:stream/promises";
import { createReadStream } from "node:fs";

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
      break;
    case "rn":
      break;
    case "cp":
      break;
    case "mv":
      break;
    case "rm":
      break;
  }
});
