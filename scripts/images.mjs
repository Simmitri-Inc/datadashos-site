// Builds web-sized product screens from the full-size sources in assets/img/screens/src-png/.
// Run with `npm run images` after adding or replacing a screen.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ROOT } from "./lib/config.mjs";

const srcDir = path.join(ROOT, "assets/img/screens/src-png");
const outDir = path.join(ROOT, "assets/img/screens");

for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".png"))) {
  const name = file.replace(/\.png$/, "");
  const input = sharp(path.join(srcDir, file));
  const { width } = await input.metadata();
  for (const w of [800, 1600]) {
    await sharp(path.join(srcDir, file))
      .resize({ width: Math.min(w, width) })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(outDir, `${name}-${w}.webp`));
  }
  await sharp(path.join(srcDir, file))
    .resize({ width: Math.min(1600, width) })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(path.join(outDir, `${name}-1600.png`));
  console.log(`  ${name}`);
}
