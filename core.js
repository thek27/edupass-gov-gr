require("dotenv").config();
const sleep = require("await-sleep");

async function select_item(page, input, value) {
  let prev = await page.evaluateHandle(
    (el) => el.previousElementSibling,
    input
  );
  await prev.click();
  await page.waitForSelector("ul");
  await page.click('li[data-value="' + value + '"]');
  await sleep(1000);
}

async function start(page) {
  const args = process.argv.slice(2);

  await page.goto("https://edupass.gov.gr/start/");
  await page.click('input[value="schools"]');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  await page.click('input[value="studentCard"]');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  await sleep(1000);

  buttons = await page.$$("button");
  if (!buttons[4]) {
    await page.click('a[data-testid="button"]');
    await page.waitForNavigation();
    await sleep(1000);

    buttons = await page.$$("button");
    await buttons[0].click();
    await page.waitForNavigation();
    await sleep(1000);

    await page.type('input[name="j_username"]', process.env.GSIS_USERNAME);
    await page.type('input[name="j_password"]', process.env.GSIS_PASSWORD);
    await page.click("#btn-login-submit");
    await sleep(1000);
    try {
      await page.click("#btn-submit");
      await page.waitForNavigation();
    } catch (e) {}

    await sleep(1000);
    buttons = await page.$$("button");
  }
  await buttons[4].click();
  await page.waitForNavigation();
  await sleep(1000);

  buttons = await page.$$("button");
  await buttons[1].click();

  let inputs = await page.$$("input");
  await select_item(page, inputs[0], process.env.REGION);
  await select_item(page, inputs[1], process.env.UNITY);
  await select_item(page, inputs[2], process.env.AREA);
  await select_item(page, inputs[3], process.env.CATEGORY);
  await select_item(page, inputs[4], process.env.TYPE);
  await select_item(page, inputs[12], process.env.GDPR);
  await select_item(page, inputs[16], process.env.RESULT);

  await page.type('input[name="input_firstname"]', process.env.FIRST_NAME);
  await page.type('input[name="input_lastname"]', process.env.LAST_NAME);

  let parts = process.env.BIRTH_DATE.split("-");
  await page.type('input[name="input_dob-day"]', parts[0]);
  await page.type('input[name="input_dob-month"]', parts[1]);
  await page.type('input[name="input_dob-year"]', parts[2]);
  await page.type('input[name="input_amka"]', process.env.AMKA);

  let d = "",
    m = "",
    y = "";
  if (args[0]) {
    parts = args[0].split("-");
    d = parts[0];
    m = parts[1];
    y = parts[2];
  } else {
    const now = new Date();
    d = now.getDate().toString();
    m = (now.getMonth() + 1).toString();
    y = now.getFullYear().toString();
  }
  await page.type('input[name="self_test_date-day"]', d);
  await page.type('input[name="self_test_date-month"]', m);
  await page.type('input[name="self_test_date-year"]', y);

  buttons = await page.$$("button");
  // await buttons[buttons.length - 1].click();
}

exports.start = start;
