// Stages the browser GUI's static files into dist/ for `gh-pages -d dist`.
// No bundler needed - index.html loads a single <script type="module"
// src="gui.js">, and gui.js's own imports resolve the rest of lib/ at
// runtime, so "build" is just "copy the files gh-pages needs to serve"
// verbatim, relative paths intact.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of ["index.html", "propp.css", "gui.js"]) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

fs.cpSync(path.join(root, "lib"), path.join(dist, "lib"), {
  recursive: true,
});

console.log(`Staged GUI files into ${dist}`);
