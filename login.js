const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

const testCase = process.argv[2]; // Nhận test case từ tham số dòng lệnh

(async function loginTest() {
  let options = new chrome.Options();

  let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    await driver.manage().window().maximize();
    await driver.get("http://localhost:10000/account/login");
    await driver.wait(until.elementLocated(By.name("username")), 10000);

    const runTest = async (id, description, testFunc) => {
      if (!testCase || testCase == id) {
        console.log(`Test ${id}: ${description}`);
        await testFunc();
      }
    };

    // Test Case 1: Đăng nhập thành công
    await runTest(1, "Đăng nhập thành công", async () => {
      await driver.findElement(By.name("username")).clear();
      await driver.findElement(By.name("username")).sendKeys("huy1");
      await driver.findElement(By.name("password")).clear();
      await driver.findElement(By.name("password")).sendKeys("123456");

      let submitButton = await driver.findElement(By.id("submit-btn"));
      await driver.executeScript("arguments[0].scrollIntoView();", submitButton);
      await driver.sleep(1000);
      await submitButton.click();

      console.log("Đăng nhập thành công!");
    });

    // Test Case 2: Sai mật khẩu
    await runTest(2, "Sai mật khẩu", async () => {
      await driver.findElement(By.name("username")).clear();
      await driver.findElement(By.name("username")).sendKeys("huy1");
      await driver.findElement(By.name("password")).clear();
      await driver.findElement(By.name("password")).sendKeys("wrongpass");

      let submitButton = await driver.findElement(By.id("submit-btn"));
      await driver.executeScript("arguments[0].scrollIntoView();", submitButton);
      await driver.sleep(1000);
      await submitButton.click();

      await driver.sleep(1000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let alertText = await alertElement[0].getText();
      console.log("Thông báo từ server:", alertText);
      assert.equal(alertText, "Tên tài khoản hoặc mật khẩu không đúng!");
    });

  } finally {
    await driver.sleep(3000);
    await driver.quit();
  }
})();
