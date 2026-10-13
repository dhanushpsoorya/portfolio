import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = resolve(web, "..");
const dist = resolve(web, "dist");

const assets = [
  "IMG-20240813-WA0036.jpg",
  "IMG-20240813-WA0036-1600.webp",
  "IMG-20240813-WA0036-800.webp",
  "IMG-20240813-WA0020.jpg",
  "IMG-20240813-WA0020.webp",
  "IMG-20261013-WA0032.jpg",
  "IMG-20261013-WA0032.webp",
  "IMG-20260729-WA0059.jpg",
  "IMG-20260729-WA0059.webp",
  "IMG-20240813-WA0019.jpg",
  "IMG-20240813-WA0019.webp",
  "google-ai-essentials.jpg",
  "google-ai-essentials.webp",
];
const images = [
  "unemployment-cover.png",
  "resume-cover.png",
  "hospital-cover.png",
  "pdf-cover.png",
];

function put(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

for (const name of assets) put(resolve(root, "assets", name), resolve(dist, "assets", name));
for (const name of images) put(resolve(root, "images", name), resolve(dist, "images", name));
put(resolve(root, "resume.html"), resolve(dist, "resume.html"));
put(resolve(root, "resume.pdf"), resolve(dist, "resume.pdf"));
put(resolve(root, "css", "resume.css"), resolve(dist, "css", "resume.css"));

// Vite already copies public/, but keep SEO assets explicit if present.
const pub = resolve(web, "public");
for (const name of readdirSync(pub)) {
  put(resolve(pub, name), resolve(dist, name));
}
