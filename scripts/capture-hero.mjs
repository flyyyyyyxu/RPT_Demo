import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../client/public/hero-mockup.png");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL ?? "http://localhost:5173";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  await mkdir(dirname(OUT), { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ["--hide-scrollbars"],
  });
  const page = await browser.newPage();
  page.on("console", (m) => console.log("[page]", m.type(), m.text()));

  console.log("→ Step 1");
  await page.goto(`${BASE}/create`, { waitUntil: "networkidle2" });
  await page.waitForSelector('input[placeholder*="温和氨基酸洁面"]');
  await page.type('input[placeholder*="温和氨基酸洁面"]', "小奶花氨基酸温和洁面乳 100ml");
  await page.type("textarea", "专为敏感肌研发的氨基酸洁面乳，绵密泡沫一推就出，洗完不紧绷不拔干。pH 5.5 弱酸配方，主打深层清洁 + 温和养护，学生党和日常通勤都能用。");

  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const wanted = ["敏感肌适用", "氨基酸", "洗后不紧绷", "温和清洁", "学生党"];
    wanted.forEach((t) => btns.find((b) => b.textContent.trim() === t)?.click());
  });

  await sleep(500);
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim().includes("下一步"))?.click();
  });

  await page.waitForFunction(() => location.pathname === "/create/strategy", { timeout: 30000 });
  console.log("→ Step 2");
  await sleep(1200);
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim().includes("下一步"))?.click();
  });

  await page.waitForFunction(() => location.pathname === "/create/images", { timeout: 30000 });
  console.log("→ Step 3");
  await sleep(500);
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "跳过图片编辑")?.click();
  });

  await page.waitForFunction(() => location.pathname === "/create/result", { timeout: 30000 });
  console.log("→ Step 4, waiting for generation…");

  await page.waitForFunction(
    () => document.body.innerText.includes("生成预览") && !document.body.innerText.includes("AI 正在创作"),
    { timeout: 120000 }
  );
  await sleep(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);

  await page.screenshot({ path: OUT, type: "png", fullPage: false });
  console.log("✓ wrote", OUT);
  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
