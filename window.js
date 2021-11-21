const { BrowserWindow, app } = require("electron");
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");
const { start } = require("./core");

const main = async () => {
    await pie.initialize(app);
    const browser = await pie.connect(app, puppeteer);

    const window = new BrowserWindow({ width: 1080, height: 1080 });
    // window.webContents.openDevTools({ mode: "bottom" });

    const url = "https://edupass.gov.gr/start/";
    await window.loadURL(url);

    const page = await pie.getPage(browser, window);
    start(page);
};

main();
