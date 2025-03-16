const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function login() {
    let options = new chrome.Options();
    options.addArguments("--start-fullscreen");
  
    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    await driver.manage().window().maximize();
    // Điều hướng đến trang đăng nhập
    await driver.get("http://localhost:10000/account/login");

    // Nhập tài khoản và mật khẩu
    await driver.findElement(By.name("username")).sendKeys("huy1");
    await driver.findElement(By.name("password")).sendKeys("123456");

    // Nhấn Đăng nhập
    await driver.findElement(By.id("submit-btn")).click();

    // Chờ phản hồi từ server
    try {
      let alertElement = await driver.wait(
        until.elementLocated(By.id("alert-text")),
        5000
      );
      let alertText = await alertElement.getText();
      console.log("Thông báo từ server:", alertText);
    } catch (error) {
      console.log("Không nhận được phản hồi từ server hoặc đăng nhập thất bại!");
    }
  } finally {
    // Đợi 3 giây trước khi đóng trình duyệt
    await driver.sleep(3000);
    await driver.quit();
  }
})();
