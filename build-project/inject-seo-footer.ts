import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const MARKER = "<!-- SEO_FOOTER -->";
const distIndex = path.resolve("dist/index.html");
const snippetPath = path.resolve("public/seo/footer-snippet.html");

const html = readFileSync(distIndex, "utf-8");
const snippet = readFileSync(snippetPath, "utf-8");

if (!html.includes(MARKER)) {
  console.error(`Marker "${MARKER}" not found in dist/index.html`);
  process.exit(1);
}

writeFileSync(distIndex, html.replace(MARKER, snippet));
console.log("SEO footer injected into dist/index.html");
