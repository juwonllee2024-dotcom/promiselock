import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of ["content", "popup"]) {
  await build({
    entryPoints: [path.join(root, "src", `${entry}.ts`)],
    bundle: true,
    format: "iife",
    outfile: path.join(dist, `${entry}.js`),
    platform: "browser",
    target: "chrome114",
  });
}

await copyFile(path.join(root, "manifest.json"), path.join(dist, "manifest.json"));
await copyFile(path.join(root, "popup.html"), path.join(dist, "popup.html"));
