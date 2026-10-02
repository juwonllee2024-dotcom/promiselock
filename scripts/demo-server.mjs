import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
]);

const server = http.createServer(async (request, response) => {
  const requestPath = request.url === "/" ? "/examples/demo.html" : request.url?.split("?")[0] ?? "/";
  let decoded;
  try {
    decoded = decodeURIComponent(requestPath);
  } catch {
    response.writeHead(400).end("Bad path");
    return;
  }

  const filePath = path.resolve(root, `.${decoded}`);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, { "content-type": mime.get(path.extname(filePath)) ?? "application/octet-stream" });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

const port = Number(process.env.PORT ?? 4173);
server.listen(port, "127.0.0.1", () => {
  console.log(`PromiseLock demo: http://127.0.0.1:${port}/`);
});
