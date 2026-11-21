import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const config = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));

export const SITE_URL = config.siteUrl.replace(/\/$/, "");
export const absUrl = (p = "") => `${SITE_URL}/${String(p).replace(/^\.?\//, "")}`;
