const puppeteer = require("puppeteer");
const url = "https://www.entitree.com/en/family_tree/Jeffrey_Epstein";
async function run() {
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await page.setViewport({ width: 1024, height: 800 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: "./public/family_tree/Jeffrey_Epstein.jpg",
    type: "jpeg",
    fullPage: true,
  });
  await page.close();
  await browser.close();
}
run();
