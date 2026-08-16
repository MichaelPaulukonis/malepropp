// Stages the browser GUI's static files into dist/ for `gh-pages -d dist`.
// No bundler needed - index.html loads these files directly as <script> tags,
// so "build" is just "copy the files gh-pages needs to serve" verbatim.
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
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
