import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { parentPort } from "node:worker_threads";

parentPort.on("message", (value) => {
  readFile(value).then((content) =>
    parentPort.postMessage(createHash("sha3-256").update(content).digest("hex"))
  );
});
