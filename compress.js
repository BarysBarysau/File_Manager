import { parentPort } from "node:worker_threads";
import { createReadStream, createWriteStream } from "node:fs";
import * as zlib from "node:zlib";

parentPort.on("message", (value) => {
  const source = createReadStream(value[1]);
  const destination = createWriteStream(value[2]);
  const buffer = Buffer.from("utf8");

  switch (value[0]) {
    case "compress":
      const brotli = zlib.createBrotliCompress();
      const stream = source.pipe(brotli).pipe(destination);

      stream.on("finish", () => {
        parentPort.postMessage("Compressed successfully");
      });
      break;

    case "decompress":
      const brotlid = zlib.createBrotliDecompress();
      const streamd = source.pipe(brotlid).pipe(destination);

      streamd.on("finish", () => {
        parentPort.postMessage("Deompressed successfully");
      });
      break;
  }
});
