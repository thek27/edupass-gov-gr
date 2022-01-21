const puppeteer = require("puppeteer");
const { start } = require("./core");

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1080,
            height: 1080,
        },
        args: ["--window-size=1920x1080"],
    });

    const page = await browser.newPage();
    await start(page);
}
main();
