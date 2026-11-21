// Captures the KPI scorecard and AI coach screens from a DataDashOS demo workspace (sample data only)
// at 1600×1000, 2× scale. Requires: npm i -D playwright && npx playwright install chromium
//
//   APP_URL=https://app.example.com DEMO_EMAIL=demo@example.com DEMO_PASSWORD=... node scripts/capture-app-screens.mjs
//
// Writes assets/img/screens/src-png/app-kpi-scorecard.png and app-ai-coach.png; then run `npm run images`
// and swap the placeholderShot() calls in scripts/pages/how-it-works.mjs for shot().
import path from "node:path";
import { ROOT } from "./lib/config.mjs";

const { APP_URL, DEMO_EMAIL, DEMO_PASSWORD } = process.env;
if (!APP_URL || !DEMO_EMAIL || !DEMO_PASSWORD) {
  console.error("Set APP_URL, DEMO_EMAIL and DEMO_PASSWORD (a demo workspace that contains sample data only).");
  process.exit(1);
}

const { chromium } = await import("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });

await page.goto(new URL("/auth", APP_URL).href);
await page.fill('input[type="email"]', DEMO_EMAIL);
await page.fill('input[type="password"]', DEMO_PASSWORD);
await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/auth"), { timeout: 30000 }), page.click('button[type="submit"]')]);

const screens = [
  ["/os/scorecard", "app-kpi-scorecard"],
  ["/os/coaches", "app-ai-coach"],
];
for (const [route, name] of screens) {
  await page.goto(new URL(route, APP_URL).href, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const out = path.join(ROOT, "assets/img/screens/src-png", `${name}.png`);
  await page.screenshot({ path: out });
  console.log(`Saved ${out}`);
}
await browser.close();
