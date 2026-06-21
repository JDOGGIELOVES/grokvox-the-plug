import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");

function renderPng(svgPath, width, transparent = false) {
  const svg = readFileSync(svgPath, "utf8");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    background: transparent ? "transparent" : undefined,
  });
  return resvg.render().asPng();
}

const darkSvg = join(iconsDir, "groknet-plug-icon-dark.svg");
const transparentSvg = join(iconsDir, "groknet-plug-icon-transparent.svg");
const icon180Svg = join(iconsDir, "groknet-plug-icon-180.svg");

const png16 = renderPng(icon180Svg, 16);
const png32 = renderPng(icon180Svg, 32);
const png180 = renderPng(icon180Svg, 180);
const png512 = renderPng(darkSvg, 512);
const png512Transparent = renderPng(transparentSvg, 512, true);

writeFileSync(join(publicDir, "favicon-16x16.png"), png16);
writeFileSync(join(publicDir, "favicon-32x32.png"), png32);
writeFileSync(join(publicDir, "apple-touch-icon.png"), png180);
writeFileSync(join(iconsDir, "groknet-plug-icon-180.png"), png180);
writeFileSync(join(iconsDir, "groknet-plug-icon-512.png"), png512);
writeFileSync(
  join(iconsDir, "groknet-plug-icon-512-transparent.png"),
  png512Transparent,
);

const faviconIco = await toIco([png16, png32]);
writeFileSync(join(publicDir, "favicon.ico"), faviconIco);

console.log("Wrote public/favicon.ico");
console.log("Wrote public/favicon-16x16.png");
console.log("Wrote public/favicon-32x32.png");
console.log("Wrote public/apple-touch-icon.png");
console.log("Wrote public/icons/groknet-plug-icon-180.png");
console.log("Wrote public/icons/groknet-plug-icon-512.png");
console.log("Wrote public/icons/groknet-plug-icon-512-transparent.png");